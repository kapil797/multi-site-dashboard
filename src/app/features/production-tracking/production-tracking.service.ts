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
import { ProductionTrackingModule } from '@pt/production-tracking.module';
import {
  Execution,
  ProcessTrackingMap,
  ProcessTrackingItem,
  SalesOrder,
  WorkOrder,
  LineItemAggregate,
  RpsWorkOrder,
  SalesOrderAggregate,
  SalesOrderStatus,
  LineItem,
} from '@pt/production-tracking.model';

import salesOrder from './mock-data/sales-order.json';
import processTracking from './mock-data/process-tracking.json';
import { chunk } from '@core/utils/formatters';

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
  providedIn: ProductionTrackingModule,
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
          return this.constructLineItemAggregate$.bind(this, row, parentWorkOrder, workOrderFamilies);
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

        let salesOrderAgg = salesOrder as SalesOrderAggregate;
        salesOrderAgg.lineItemAggregates = flatten;

        // Update status.
        salesOrderAgg = this.aggregateSalesOrderStatus(salesOrderAgg);
        return salesOrderAgg;
      })
    );
  }

  private constructLineItemAggregate$(item: LineItem, parentWorkOrder: WorkOrder, workOrderFamily?: RpsWorkOrder[]) {
    // Each parent WorkOrder should have 1:1 mapping with workOrderFamily.
    const obs$ = workOrderFamily
      ? of(workOrderFamily)
      : this.fetchWorkOrderFamilies$(this.app.factory(), parentWorkOrder.workOrderNumber);

    return obs$.pipe(
      switchMap(res => {
        const workOrderFamily = res.find(row => row.woid === parentWorkOrder.workOrderNumber);
        if (!workOrderFamily) return throwError(() => `Unable to find WorkOrder family for ${item.productName}`);

        const agg: LineItemAggregate = {
          ...item,
          workOrderFamily,
          executions: [],
        };
        return this.populateExecutionsForLineItemAggregate$(agg);
      })
    );
  }

  public populateExecutionsForLineItemAggregate$(agg: LineItemAggregate) {
    // Fetch all executions for each line item in chunks in parallel.
    // Each line item can have multiple WorkOrders.
    const chunkSize = 5;
    const correlationIds: number[] = [];
    this.dfsRpsWorkOrder(agg.workOrderFamily, 'id', correlationIds);
    const parallelRequests = correlationIds.map(id => this.fetchExecutions$.bind(this, this.app.factory(), id));
    return from(chunk(parallelRequests, chunkSize) as (() => Observable<Execution[]>)[][]).pipe(
      concatMap(chunk => {
        return forkJoin(chunk.map(f => f()));
      }),
      toArray(),
      switchMap(res => {
        // Flatten response and update each execution process.
        res.forEach(chunk =>
          chunk.forEach(executions =>
            executions.forEach(row => {
              row.partsCompleted = `${row.completeQty} of ${row.releasedQty}`;
              agg.executions.push(row);
            })
          )
        );
        return this.fetchProcessTrackingMap$(this.app.factory(), agg);
      }),
      map(res => {
        agg.processTrackingMap = res;
        return agg;
      }),
      retry(2)
    );
  }

  public aggregateSalesOrderStatus(agg: SalesOrderAggregate) {
    // To get the status of a SalesOrder, need to sum the releasedQty
    // and completedQty for all related executions, regardless of lineItems.
    const status: SalesOrderStatus = {
      releasedQty: 0,
      completedQty: 0,
      lastUpdated: '',
    };
    agg.lineItemAggregates.forEach(product => {
      product.executions.forEach(row => {
        this.aggregateStatusFromExecution(row, status);
      });
    });

    agg.progress = Math.round((status.completedQty / status.releasedQty) * 100);
    agg.estimatedCompleteTime = status.estimatedCompleteTime ? status.estimatedCompleteTime : undefined;
    agg.completedTime =
      status.lastUpdated && status.completedQty === status.releasedQty ? status.lastUpdated : undefined;
    agg.lastUpdated = status.lastUpdated;
    return agg;
  }

  private aggregateStatusFromExecution(row: Execution, status: SalesOrderStatus) {
    // Update quantities.
    status.releasedQty += row.releasedQty;
    status.completedQty += row.completeQty;

    // Update endTime if any; take the latest value.
    if (!status.lastUpdated) {
      status.lastUpdated = row.processEndTime || row.processStartTime || '';
    } else if (status.lastUpdated && row.processEndTime) {
      const latest = Math.max(new Date(status.lastUpdated).getTime(), new Date(row.processEndTime).getTime());
      status.lastUpdated = new Date(latest).toISOString();
    }

    // Updated estCompleteTime if any; take the latest value.
    if (!status.estimatedCompleteTime) {
      status.estimatedCompleteTime = row.estimateCompleteTime;
    } else {
      const latest = Math.max(
        new Date(status.estimatedCompleteTime).getTime(),
        new Date(row.estimateCompleteTime).getTime()
      );
      status.estimatedCompleteTime = new Date(latest).toISOString();
    }
  }

  public fetchSalesOrders$(factory: string, limit?: number) {
    const api = this.app.api.concatOrderappApiByFactory(factory, [this.app.api.ORDERAPP_SALES_ORDER]);
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
    const api = this.app.api.concatRpsApiByFactory(factory, [
      this.app.api.RPS_WORK_ORDER,
      'salesorders',
      String(salesOrderId),
    ]);
    return this.http
      .get<WorkOrder[]>(api)
      .pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchWorkOrderFamilies$(factory: string, workOrderNumber?: string) {
    // Currently fetching the entire list vs querying by WorkOrderNumber takes only
    // a slightly longer time than querying by WorkOrderNumber i.e. 7s vs 5s.
    // Fetching the entire list may be faster as you can execute parallel requests
    // without requiring the WorkOrderNumber from RPS API.
    const api = this.app.api.concatRtdApiByFactory(factory, [this.app.api.RTD_WORK_ORDER]);
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

  public dfsRpsWorkOrder(node: RpsWorkOrder, key: string, results: unknown[]) {
    if (key === 'id') results.push(node.id);
    else if (key === 'workOrderNumber') results.push(node.woid);
    node.subWorkOrders.forEach(row => {
      this.dfsRpsWorkOrder(row, key, results);
    });
  }

  public fetchExecutions$(factory: string, correlationId?: number, startDateTime?: string) {
    // Fetching the list by correlationId is much faster than querying by startDateTime.
    // i.e. 30ms vs 5s.
    const api = this.app.api.concatRtdApiByFactory(factory, [this.app.api.RTD_EXECUTION]);
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
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))),
      map(res => {
        const data = res.data as Execution[];
        return data;
      })
    );
  }

  public fetchProcessTrackingMap$(_factory: string, lineItem: LineItemAggregate) {
    return of(processTracking as ProcessTrackingMap[]).pipe(
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))),
      map(res => {
        const template = res.find(row => row.productId === lineItem.productId);
        if (!template) return this.constructDynamicProcessTrackingMap(lineItem);
        return this.updateProcessTrackingMap(lineItem, template);
      })
    );
  }

  public constructDynamicProcessTrackingMap(lineItem: LineItemAggregate) {
    // For SES products.
    const items: ProcessTrackingItem[] = lineItem.executions.map(row => {
      return {
        text: row.process.name,
        id: row.process.id,
        statusId: row.statusId,
        row: 0,
        col: row.step - 1, // 0-indexed.
      };
    });
    return {
      productId: lineItem.productId,
      category: 'Smart Engineering Systems (SES)',
      rows: 1,
      cols: items.length,
      items,
    } as ProcessTrackingMap;
  }

  public updateProcessTrackingMap(lineItem: LineItemAggregate, template: ProcessTrackingMap) {
    const processMap = new Map<number, Execution>();
    lineItem.executions.forEach(row => processMap.set(row.process.id, row));
    template.items = template.items.map(row => {
      const process = processMap.get(row.id);
      if (process) row.statusId = process.statusId;
      return row;
    });
    return template;
  }

  public getParentWorkOrder(v: string) {
    // 2402190003.01.01 to 2402190003
    return v.split('.')[0];
  }
}
