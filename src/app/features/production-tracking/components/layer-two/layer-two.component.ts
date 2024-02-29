import { Component, OnInit } from '@angular/core';
import { Observable, concatMap, delay, from, map, retry, switchMap, takeUntil, throwError, toArray } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { createNotif } from '@core/utils/notification';
import {
  Execution,
  ExecutionStream,
  LineItem,
  LineItemAggregate,
  SalesOrder,
  SalesOrderAggregate,
  WebsocketStream,
  WorkOrder,
} from '@pt/production-tracking.model';
import { Dropdown } from '@core/classes/form/form.class';
import { webSocket } from 'rxjs/webSocket';

interface SalesOrderStatus {
  releasedQty: number;
  completedQty: number;
  endTime?: string;
  estimatedCompleteTime?: string;
}

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public salesOrderIds: Dropdown[];
  public factory: string;
  public salesOrderAggregate?: SalesOrderAggregate;
  private salesOrderMap: Map<string, SalesOrder> = new Map();
  private executionStreamFromRtd$: Observable<unknown>;

  constructor(
    private app: AppService,
    private pt: ProductionTrackingService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initWebSocketStreams();

    this.executionStreamFromRtd$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(msg => {
      // Update by LineItem if change is relevant.
      const res = msg as ExecutionStream;
      console.log(res);
      const lineItemAgg = this.salesOrderAggregate?.lineItemAggregates.find(row => {
        const temp = row.workOrders.find(wo => wo.workOrderNumber === res.WOID);
        return temp ? true : false;
      });
      if (lineItemAgg) {
        this.constructLineItemAggregate$(lineItemAgg, lineItemAgg.workOrders).subscribe({
          next: res => {
            const idx = this.salesOrderAggregate?.lineItemAggregates.findIndex(row => row.productId === res.productId);
            this.salesOrderAggregate?.lineItemAggregates.splice(idx as number, 0, res);
            this.salesOrderAggregate = JSON.parse(JSON.stringify(this.salesOrderAggregate));
          },
          error: error => {
            this.notif.show(createNotif('error', error));
          },
        });
      }
    });

    this.pt
      .fetchSalesOrders$(this.app.factory())
      .pipe(
        switchMap(res => {
          if (res.length === 0) return throwError(() => new Error('SalesOrder entries are empty'));

          // Update SalesOrderMap.
          res.forEach(row => this.salesOrderMap.set(row.salesOrderNumber, row));
          this.salesOrderIds = res.map(row => {
            return {
              text: row.salesOrderNumber,
              value: row.salesOrderNumber,
            };
          });

          // Fetch aggregate for first SalesOrder.
          return this.aggregateSalesOrderByLineItems$(res[0].salesOrderNumber);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: res => {
          this.salesOrderAggregate = res;
          this.isLoading = false;
        },
        error: (error: string) => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private initWebSocketStreams() {
    const websocket$ = webSocket({
      url: this.app.config.DASHBOARD_WEBSOCKET_URL,
    });

    this.executionStreamFromRtd$ = websocket$.multiplex(
      () => ({
        message: 'subscribing to RTD execution stream',
      }),
      () => ({
        message: 'unsubscribing from RTD execution stream',
      }),
      message => {
        const msg = message as WebsocketStream;
        return !!msg.type && msg.type.toUpperCase() === 'RTD';
      }
    );
  }

  public onChangeSalesOrder(event: unknown) {
    this.isLoading = true;
    this.aggregateSalesOrderByLineItems$(event as string)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.salesOrderAggregate = res;
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          this.salesOrderAggregate = undefined;
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private aggregateSalesOrderByLineItems$(salesOrderId: string) {
    // For each SalesOrder, in order to get the progress and completion time,
    // will need to aggregate from all LineItems.
    const salesOrder = this.salesOrderMap.get(salesOrderId);
    if (!salesOrder) {
      return throwError(() => `SalesOrder ${salesOrderId} is invalid`);
    }
    return this.pt.fetchWorkOrders$(this.factory, [salesOrderId]).pipe(
      delay(1000),
      switchMap(res => {
        const parallelRequests = salesOrder.lineItems.map(row => {
          return this.constructLineItemAggregate$.bind(this, row, res);
        });
        return from(parallelRequests);
      }),
      concatMap(f => {
        return f();
      }),
      toArray(),
      map(res => {
        let salesOrderAgg = salesOrder as SalesOrderAggregate;
        salesOrderAgg.lineItemAggregates = res;

        // Update status.
        salesOrderAgg = this.aggregateSalesOrderStatus(salesOrderAgg);
        return salesOrderAgg;
      })
    );
  }

  private constructLineItemAggregate$(item: LineItem, workOrders: WorkOrder[]) {
    // Sacrifice optimization for simplicity.
    // Each product is required to loop through list of WorkOrders.
    const agg: LineItemAggregate = {
      ...item,
      workOrders: [],
      executions: [],
    };

    const workOrderNumbers: string[] = [];
    workOrders.forEach(row => {
      if (row.productId === item.productId) {
        agg.workOrders.push(row);
        workOrderNumbers.push(row.workOrderNumber);
      }
    });
    return this.pt.fetchExecutions$(this.factory, workOrderNumbers).pipe(
      retry(2),
      switchMap(res => {
        res.forEach(row => {
          row.partsCompleted = `${row.completeQty} of ${row.releasedQty}`;
          agg.executions.push(row);
        });
        return this.pt.fetchProcessTrackingMap$(this.factory, agg);
      }),
      map(res => {
        agg.processTrackingMap = res;
        return agg;
      })
    );
  }

  private aggregateSalesOrderStatus(agg: SalesOrderAggregate) {
    // To get the status of a SalesOrder, need to sum the releasedQty
    // and completedQty for all related executions, regardless of lineItems.
    const status: SalesOrderStatus = {
      releasedQty: 0,
      completedQty: 0,
    };
    agg.lineItemAggregates.forEach(product => {
      product.executions.forEach(row => {
        this.aggregateStatusFromExecution(row, status);
      });
    });

    agg.progress = Math.round((status.completedQty / status.releasedQty) * 100);
    agg.estimatedCompleteTime = status.estimatedCompleteTime ? status.estimatedCompleteTime : undefined;
    agg.completedTime = status.endTime && status.completedQty === status.releasedQty ? status.endTime : undefined;
    return agg;
  }

  private aggregateStatusFromExecution(row: Execution, status: SalesOrderStatus) {
    // Update quantities.
    status.releasedQty += row.releasedQty;
    status.completedQty += row.completeQty;

    // Update endTime if any; take the latest value.
    if (!status.endTime && row.processEndTime) {
      status.endTime = row.processEndTime;
    } else if (status.endTime && row.processEndTime) {
      const latest = Math.max(new Date(status.endTime).getTime(), new Date(row.processEndTime).getTime());
      status.endTime = new Date(latest).toISOString();
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
}
