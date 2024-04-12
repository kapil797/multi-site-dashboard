import { Component, OnInit } from '@angular/core';
import { of, switchMap, takeUntil, throwError } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { createNotif } from '@core/utils/notification';
import { RpsSalesOrder, RtdStream, SalesOrderAggregate } from '@pt/production-tracking.model';
import { Dropdown } from '@core/classes/form/form.class';
import { consumerStreams, filterStreamsFromWebsocketGateway$ } from '@core/models/websocket.model';

/*
  Each SalesOrder can consist of multiple LineItems.
  Each LineItem will correspond to a parent WorkOrder, and can have 
  multiple subWorkOrders.

  Consolidation of SalesOrder aggregate is as follows:
  1. Aggregate each LineItem, and perform each request in parallel (by chunk)

  Consolidation of LineItem aggregate is as follows:
  1. Get parent WorkOrder from RPS
  2. Get WorkOrderFamily from RTD by parent WorkOrderNumber
  3. WorkOrderFamily consists of correlationId, which is used to map WorkOrderNumber to Id in RPS
  4. Currently, correlationId to WorkOrderNumber is 1:1 mapping
  5. Fetch all related executions for each correlationId (by chunk)
*/

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public salesOrderIds: Dropdown[];
  public salesOrderAggregate?: SalesOrderAggregate;
  private salesOrderMap: Map<string, RpsSalesOrder> = new Map();
  private chunkLineItems = 3;

  constructor(
    private app: AppService,
    private pt: ProductionTrackingService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    filterStreamsFromWebsocketGateway$(this.app.wsGateway$, [consumerStreams.RTD])
      .pipe(
        switchMap(msg => {
          // Update by LineItem if change is relevant.
          const res = JSON.parse(msg.data) as RtdStream;
          const lineItemAgg = this.salesOrderAggregate?.lineItemAggregates.find(row => {
            const parentWorkOrderNumber = row.workOrderAggregates[0].workOrderNumber;
            if (res.WOID.includes(parentWorkOrderNumber)) return true;
            return false;
          });

          if (!lineItemAgg) return of(null);
          return this.pt.aggregateLineItem$(lineItemAgg, lineItemAgg.workOrderAggregates[0].workOrderNumber);
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe({
        next: res => {
          if (!res) return;

          const idx = this.salesOrderAggregate?.lineItemAggregates.findIndex(row => row.productId === res.productId);
          if (!idx) return;
          this.salesOrderAggregate?.lineItemAggregates.splice(idx, 1, res);
          this.salesOrderAggregate = JSON.parse(JSON.stringify(this.salesOrderAggregate));
        },
        error: (err: Error) => {
          this.notif.show(createNotif('error', err.message));
        },
      });

    // Fetch all SalesOrders and aggregate first SalesOrder.
    this.pt
      .fetchSalesOrdersFromRps$(this.app.factory())
      .pipe(
        switchMap(res => {
          if (res.length === 0) return throwError(() => new Error('There are no SalesOrder outstanding'));

          // Update SalesOrderMap.
          res.forEach(row => this.salesOrderMap.set(row.salesOrderNumber, row));
          this.salesOrderIds = res.map(row => {
            return {
              text: row.salesOrderNumber,
              value: row.salesOrderNumber,
            };
          });
          if (res.length === 0) return throwError(() => 'There are no SalesOrder outstanding');

          // Fetch aggregate for first SalesOrder.
          return this.pt.aggregateSalesOrderByLineItems$(res[0], this.chunkLineItems);
        }),
        takeUntil(this.ngUnsubscribe$)
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

  public onChangeSalesOrder(event: unknown) {
    const salesOrder = this.salesOrderMap.get(event as string);
    if (!salesOrder) {
      this.notif.show(createNotif('error', `SalesOrder ${event} is invalid`));
      return;
    }

    this.isLoading = true;
    this.pt
      .aggregateSalesOrderByLineItems$(salesOrder, this.chunkLineItems)
      .pipe(takeUntil(this.ngUnsubscribe$))
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
}
