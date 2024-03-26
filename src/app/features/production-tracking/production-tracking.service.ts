import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  concatMap,
  forkJoin,
  from,
  map,
  of,
  retry,
  switchMap,
  throwError,
  toArray,
} from 'rxjs';

import { AppService } from '@core/services/app.service';
import {
  Execution,
  ProcessTrackingMap,
  SalesOrder,
  WorkOrder,
  LineItemAggregate,
  RpsWorkOrder,
  SalesOrderAggregate,
  LineItem,
  WorkOrderAggregate,
  WebsocketStream,
} from '@pt/production-tracking.model';

import salesOrder from './mock-data/sales-order.json';
import processTracking from './mock-data/process-tracking.json';
import { chunk } from '@core/utils/formatters';
import { webSocket } from 'rxjs/webSocket';

/*
  SalesOrder has one-to-many relationship with WorkOrders.
  WorkOrder has one-to-many relationship with Executions.
  Each execution is tied to a process.

  Each LineItem will have a separate WorkOrder.
  If a LineItem has parallel processes, it will have multiple WorkOrders.
  i.e. 2401300007, 2401300007.01, 2401300007.01.01, 2401300007.01.02

  Tree structure of a sales order aggregate:
  SalesOrder 
    -> LineItemAgg
      -> WorkOrder
      -> WorkOrder
      -> WorkOrder  
        -> Execution (step 1)
        -> Execution (step 2)
        -> Execution (step 3)
  */

interface LegacyRpsResponse {
  data: unknown[];
  message: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'any',
})
export class ProductionTrackingService {
  // Source of truth.
  // public salesOrderAggregate$ = new ReplaySubject<SalesOrderAggregate | null>();

  constructor(
    private http: HttpClient,
    private app: AppService
  ) {}

  public aggregateSalesOrderByLineItems$(
    salesOrder: SalesOrder,
    chunkSize: number,
    workOrderFamilies?: RpsWorkOrder[]
  ) {
    // For each SalesOrder, in order to get the progress and completion time,
    // will need to aggregate from all LineItems.
    return this.fetchParentWorkOrdersBySalesOrderId$(this.app.factory(), salesOrder.id).pipe(
      switchMap(res => {
        const parallelLineItems = salesOrder.lineItems.map(row => {
          const parentWorkOrder = res.find(x => x.productId === row.productId);
          if (!parentWorkOrder) return throwError(() => `Unable to find parent WorkOrder for ${row.productName}`);
          return this.aggregateLineItem$.bind(this, row, parentWorkOrder.workOrderNumber, workOrderFamilies);
        });
        const chunked = chunk(parallelLineItems, chunkSize) as (() => Observable<LineItemAggregate>)[][];
        return from(chunked);
      }),
      concatMap(chunk => {
        return forkJoin(chunk.map(f => f()));
      }),
      toArray(),
      map(res => {
        // Flatten response.
        const flatten = res.reduce((prev, cur) => {
          prev.push(...cur);
          return prev;
        }, []);

        const agg = salesOrder as SalesOrderAggregate;
        agg.lineItemAggregates = flatten;
        agg.releasedQty = 0;
        agg.completedQty = 0;
        agg.lastUpdated = agg.createdDate;

        // Update status.
        agg.lineItemAggregates.forEach(product => {
          this.aggregateSalesOrderStatus(agg, product.workOrderAggregates);
        });

        // Update progress and completedDate if applicable.
        agg.progress = Math.round((agg.completedQty / agg.releasedQty) * 100);
        if (agg.progress === 100) agg.completedDate = agg.lastUpdated;
        return agg;
      })
    );
  }

  public aggregateLineItem$(item: LineItem, parentWorkOrderNumber: string, workOrderFamily?: RpsWorkOrder[]) {
    let agg: LineItemAggregate;

    // Each parent WorkOrder should have 1:1 mapping with workOrderFamily.
    const obs$ = workOrderFamily
      ? of(workOrderFamily)
      : this.fetchWorkOrderFamilies$(this.app.factory(), parentWorkOrderNumber);

    return obs$.pipe(
      switchMap(res => {
        const workOrderFamily = res.find(row => row.woid === parentWorkOrderNumber);
        if (!workOrderFamily) return throwError(() => `Unable to find WorkOrder family for ${item.productName}`);

        // Cannot dfs WorkOrderFamily and make HTTP calls.
        const hashmap = new Map<string, WorkOrderAggregate>();
        const correlationIds: number[] = [];
        const workOrderAggregates: WorkOrderAggregate[] = [];
        this.dfsWorkOrderAggregate(workOrderFamily, hashmap, workOrderAggregates, correlationIds);
        return this.populateExecutionsInWorkOrderAggregate$(workOrderAggregates, hashmap, correlationIds);
      }),
      switchMap(res => {
        agg = {
          ...item,
          workOrderAggregates: res,
        };
        return this.fetchProcessTrackingMap$(this.app.factory(), agg.productId);
      }),
      map(res => {
        if (!res) {
          agg.processTrackingMap = this.constructDynamicProcessTrackingMap(agg.productId, agg.workOrderAggregates);
        } else {
          agg.processTrackingMap = res;
        }
        this.updateStatusOfProcessTrackingItems(agg);
        return agg;
      })
    );
  }

  private dfsWorkOrderAggregate(
    node: RpsWorkOrder,
    hashmap: Map<string, WorkOrderAggregate>,
    workOrderAggregates: WorkOrderAggregate[],
    correlationIds: number[]
  ) {
    const agg: WorkOrderAggregate = {
      correlationId: node.id,
      workOrderNumber: node.woid,
      executions: [],
      releasedQty: 0,
      completedQty: 0,
      lastUpdated: node.issueTime,
      estimatedCompleteDate: node.dueTime,
      progress: 0,
    };
    workOrderAggregates.push(agg);

    // Side effect.
    hashmap.set(node.woid, agg);
    correlationIds.push(node.id);

    node.subWorkOrders.forEach(row => {
      this.dfsWorkOrderAggregate(row, hashmap, workOrderAggregates, correlationIds);
    });
  }

  private populateExecutionsInWorkOrderAggregate$(
    workOrderAggregates: WorkOrderAggregate[],
    hashmap: Map<string, WorkOrderAggregate>,
    correlationIds: number[]
  ) {
    const chunkSize = 5;
    const parallelRequests = correlationIds.map(id => this.fetchExecutions$.bind(this, this.app.factory(), id));
    const chunked = chunk(parallelRequests, chunkSize) as (() => Observable<Execution[]>)[][];
    return from(chunked).pipe(
      concatMap(chunk => {
        return forkJoin(chunk.map(f => f()));
      }),
      toArray(),
      map(res => {
        res.forEach(chunk => {
          chunk.forEach(group => {
            if (group.length > 0) {
              const workOrderAgg = hashmap.get(group[0].woid) as WorkOrderAggregate;
              group.sort((a, b) => a.step - b.step);
              workOrderAgg.executions.push(...group);
              this.aggregateWorkOrderStatus(workOrderAgg);
            }
          });
        });
        return workOrderAggregates;
      })
    );
  }

  public aggregateSalesOrderStatus(agg: SalesOrderAggregate, workOrderAggregates: WorkOrderAggregate[]) {
    // To get the status of a SalesOrder, need to sum the releasedQty
    // and completedQty for all WorkOrders, regardless of lineItems.

    workOrderAggregates.forEach(row => {
      agg.releasedQty += row.releasedQty;
      agg.completedQty += row.completedQty;

      // For lastUpdated.
      let time1 = new Date(agg.lastUpdated as string).getTime();
      let time2 = new Date(row.lastUpdated as string).getTime();
      if (time1 < time2) agg.lastUpdated = row.lastUpdated;

      // For dueDate.
      if (!agg.estimatedCompleteDate) {
        agg.estimatedCompleteDate = row.estimatedCompleteDate;
      } else {
        time1 = new Date(agg.estimatedCompleteDate as string).getTime();
        time2 = new Date(row.estimatedCompleteDate as string).getTime();
        if (time1 < time2) agg.estimatedCompleteDate = row.estimatedCompleteDate;
      }
    });
  }

  private aggregateWorkOrderStatus(node: WorkOrderAggregate) {
    // Each execution is sorted in order of step, and steps must be completed
    // in sequential order.
    // Hence, calculation involving lastUpdated can make use of the above assumption.
    node.executions.forEach(row => {
      // Update quantities.
      node.releasedQty += row.releasedQty;
      node.completedQty += row.completeQty;

      // Get last updated.
      if (row.processEndTime) node.lastUpdated = row.processEndTime;
      if (!row.processEndTime && !node.executionStage) node.executionStage = row.process.name;
    });

    // Take last execution stage if all are completed.
    if (!node.executionStage && node.executions.length > 0) node.executionStage = node.executions[0].process.name;

    // Update progress and completedDate if applicable.
    node.progress = Math.round((node.completedQty / node.releasedQty) * 100);
    if (node.progress === 100) node.completedDate = node.lastUpdated;
  }

  public fetchSalesOrders$(factory: string, limit?: number) {
    const api = this.app.api.concatOrderappApiByFactory(factory, this.app.api.ORDERAPP_SALES_ORDER);
    const queryParams = limit ? `?limit=${limit}` : '';
    console.log(api, queryParams);

    // this.http.get<SalesOrder[]>(`${api}${queryParams}`)
    return of(salesOrder as SalesOrder[]).pipe(
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err))))
    );
  }

  public fetchParentWorkOrdersBySalesOrderId$(factory: string, salesOrderId: number) {
    // If a SalesOrder has multiple line items, each line item will have a parent WorkOrder.
    // Function should return N WorkOrders, where N == number of line items.
    // TODO: Unsure if RPS API can handle this, to monitor further.
    const api = this.app.api.concatRpsApiByFactory(
      factory,
      this.app.api.RPS_WORK_ORDER,
      'salesorders',
      String(salesOrderId)
    );
    return this.http
      .get<WorkOrder[]>(api)
      .pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchWorkOrderFamilies$(factory: string, workOrderNumber?: string) {
    // Currently fetching the entire list vs querying by WorkOrderNumber takes only
    // a slightly longer time than querying by WorkOrderNumber i.e. 7s vs 5s.
    // Fetching the entire list may be faster as you can execute parallel requests
    // without requiring the WorkOrderNumber from RPS API.
    const api = this.app.api.concatRtdApiByFactory(factory, this.app.api.RTD_WORK_ORDER);
    let payload = {};
    if (workOrderNumber) {
      payload = {
        WOID: workOrderNumber.trim(),
      };
    }
    return this.http.post<LegacyRpsResponse>(api, payload).pipe(
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))),
      map(res => {
        return res.data as RpsWorkOrder[];
      })
    );
  }

  public fetchExecutions$(factory: string, correlationId?: number, startDateTime?: string) {
    // Fetching the list by correlationId is much faster than querying by startDateTime.
    // i.e. 30ms vs 5s.
    const api = this.app.api.concatRtdApiByFactory(factory, this.app.api.RTD_EXECUTION);
    let payload = {};
    if (correlationId) {
      payload = {
        ID: correlationId,
      };
    } else if (startDateTime) {
      payload = {
        endDateTime: startDateTime,
      };
    }
    return this.http.post<LegacyRpsResponse>(api, payload).pipe(
      retry(2),
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))),
      map(res => {
        const data = res.data as Execution[];
        return data;
      })
    );
  }

  private fetchProcessTrackingMap$(_factory: string, productId: number) {
    return of(processTracking as ProcessTrackingMap[]).pipe(
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))),
      map(res => {
        const template = res.find(row => row.productId === productId);
        return template;
      })
    );
  }

  private constructDynamicProcessTrackingMap(productId: number, workOrderAggregates: WorkOrderAggregate[]) {
    // For SES products.
    const data: ProcessTrackingMap = {
      productId: productId,
      category: 'Smart Engineering Systems (SES)',
      rows: 1,
      cols: 0,
      items: [],
    };

    workOrderAggregates.forEach(row => {
      row.executions.forEach(exec => {
        const temp = {
          text: exec.process.name,
          id: exec.process.id,
          statusId: exec.statusId,
          row: 0,
          col: exec.step - 1, // 0-indexed.
        };
        data.items.push(temp);
      });
    });
    return data;
  }

  private updateStatusOfProcessTrackingItems(lineItem: LineItemAggregate) {
    const processMap = new Map<number, Execution>();

    lineItem.workOrderAggregates.forEach(row => {
      row.executions.forEach(x => {
        processMap.set(x.process.id, x);
      });
    });

    if (!lineItem.processTrackingMap) return;
    lineItem.processTrackingMap.items = lineItem.processTrackingMap.items.map(row => {
      const process = processMap.get(row.id);
      if (process) row.statusId = process.statusId;
      return row;
    });
  }

  public getParentWorkOrder(v: string) {
    // 2402190003.01.01 to 2402190003
    return v.split('.')[0];
  }

  public initWebSocketStreams() {
    const websocket$ = webSocket({
      url: this.app.config.MF_DASHBOARD_WEBSOCKET_WS_URL,
    });

    const executionStreamFromRtd$ = websocket$.multiplex(
      () => ({
        // On subscribing to websocket.
        message: 'subscribing to RTD execution stream',
      }),
      () => ({
        // On destroy.
        message: 'unsubscribing from RTD execution stream',
      }),
      message => {
        // Filter messages.
        const msg = message as WebsocketStream;
        console.log(msg);
        return !!msg.type && msg.type.toUpperCase() === 'RTD';
      }
    );
    return executionStreamFromRtd$;
  }
}
