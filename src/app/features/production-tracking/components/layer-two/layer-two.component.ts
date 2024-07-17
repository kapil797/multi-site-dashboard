import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { createNotif } from '@core/utils/notification';
import {
  Execution,
  LineItemAggregate,
  RpsSalesOrder,
  RtdStream,
  SalesOrderAggregate,
} from '@pt/production-tracking.model';
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
  public isAlert: boolean;
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
    filterStreamsFromWebsocketGateway$(this.app.wsGateway$, []).subscribe(res => {
      if (res.type === consumerStreams.RTD) {
        const msg = JSON.parse(res.data) as RtdStream;
        if (!msg || !this.salesOrderAggregate) return;
        const status = msg.WOProcessStatus ? msg.WOProcessStatus : msg.WOStatus ? msg.WOStatus : '';
        if (!['PROCESSING', 'COMPLETED'].includes(status.toUpperCase())) return;
        console.log(msg);
        const lineItemAgg = this.salesOrderAggregate?.lineItemAggregates.find(row => {
          const parentWorkOrderNumber = row.workOrderAggregates[0].workOrderNumber;
          if (msg.WOID.includes(parentWorkOrderNumber)) return true;
          return false;
        });
        if (!lineItemAgg) return;
        this.updateLineItemInSalesOrder(lineItemAgg);
      } else {
        // To ensure INTERNAL orders are captured, else listening
        // to RPS_SO_CREATED is sufficient.
        this.fetchAndUpdateNewSalesOrder();
      }
    });

    // Fetch all SalesOrders and aggregate first SalesOrder.
    this.pt
      .fetchSalesOrdersFromRps$(this.app.factory())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: res => {
          if (res.length === 0) {
            this.notif.show(createNotif('error', `There are no SalesOrder outstanding`));
            return;
          }

          this.salesOrderIds = [];
          // Update SalesOrderMap.
          res.forEach(row => {
            this.salesOrderMap.set(row.salesOrderNumber, row);
            this.salesOrderIds.push({
              text: row.salesOrderNumber,
              value: row.salesOrderNumber,
            });
          });
          // Fetch aggregate for first SalesOrder.
          this.onChangeSalesOrder(res[0].salesOrderNumber);
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
          this.isAlert = false;
        },
        error: (error: string) => {
          this.isLoading = false;
          this.salesOrderAggregate = undefined;
          console.log(error);
          if (error.toUpperCase().includes('UNABLE TO FIND WORKORDER FAMILY')) {
            this.isAlert = true;
          }
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private fetchAndUpdateNewSalesOrder() {
    this.pt
      .fetchSalesOrdersFromRps$(this.app.factory())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: res => {
          const diff = res.length - this.salesOrderMap.size;
          res = res.slice(0, diff);
          res.forEach(row => {
            this.salesOrderMap.set(row.salesOrderNumber, row);
            // Add salesOrder to SalesOrderMap at start of array.
            this.salesOrderIds.unshift({
              text: row.salesOrderNumber,
              value: row.salesOrderNumber,
            });
          });
        },
        error: error => {
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private updateLineItemInSalesOrder(res: LineItemAggregate) {
    this.pt
      .aggregateLineItem$(res, res.workOrderAggregates[0].workOrderNumber)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: res => {
          if (!this.salesOrderAggregate) return;
          const idx = this.salesOrderAggregate.lineItemAggregates.findIndex(row => row.id === res.id);
          if (idx == -1) {
            console.warn('unable to update layer2 as there are no matching line items found');
            return;
          }
          this.salesOrderAggregate.lineItemAggregates.splice(idx, 1, res);
          this.pt.aggregateSalesOrderStatus(this.salesOrderAggregate);
          this.salesOrderAggregate = JSON.parse(JSON.stringify(this.salesOrderAggregate));
        },
        error: (error: string) => {
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private updateProcessInLineItem(msg: RtdStream, lineItemAgg: LineItemAggregate) {
    const workOrderAgg = lineItemAgg.workOrderAggregates.find(row => row.workOrderNumber === msg.WOID);
    if (!workOrderAgg) return;

    // RTD will send messages of 2 similar schemas:
    // One with ProcessName, another without.
    let process: Execution | undefined;
    if (msg.ProcessName) {
      process = workOrderAgg.executions.find(row => row.process.name === msg.ProcessName);
    } else if (workOrderAgg.executions.length == 1) {
      process = workOrderAgg.executions[0];
    }
    if (!process) return;

    // Update values in process, where applicable.
    process.completeQty = msg.CompletedQty;
    process.outStandingQty = msg.OutStandingQty;
    if (msg.ScrapQty) process.scrapQty = msg.ScrapQty;
    if (msg.CompletedDate) process.processEndTime = new Date(msg.CompletedDate).toISOString();

    const status = msg.WOProcessStatus ? msg.WOProcessStatus : msg.WOStatus ? msg.WOStatus : '';
    switch (status.toUpperCase()) {
      case 'READY':
        break;
      case 'QUEUING':
        break;
      case 'PROCESSING':
        process.statusId = 8;
        break;
      case 'COMPLETED':
        process.statusId = 4;
        break;
    }

    this.pt.aggregateWorkOrderStatus(workOrderAgg);
    this.pt.updateStatusOfProcessTrackingItems(lineItemAgg);
    this.pt.aggregateSalesOrderStatus(this.salesOrderAggregate as SalesOrderAggregate);
    this.salesOrderAggregate = JSON.parse(JSON.stringify(this.salesOrderAggregate));
  }
}
