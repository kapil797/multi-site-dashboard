import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, catchError, exhaustMap, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Router } from '@angular/router';
import moment from 'moment';

import { ColumnSetting, getWidth } from '@core/models/grid.model';
import { LayerOneRouter } from '@core/classes/layer-one-router/layer-one-router.class';
import { createNotif } from '@core/utils/notification';
import { AppService } from '@core/services/app.service';
import { filterStreamsFromWebsocketGateway$ } from '@core/models/websocket.model';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import {
  RpsSalesOrder,
  RpsWorkOrder,
  SalesOrderAggregate,
  StatusAggregate,
  WorkOrderAggregate,
} from '@pt/production-tracking.model';
/*
  Total maximum number of parallel requests:
  - 6 SalesOrders
    - 3 LineItems for each SalesOrder
      - 5 Executions for each LineItem
  Total: 6*3*5 = 90 (to optimize as required).
*/

interface CompactedSalesOrder {
  salesOrderNumber: string;
  customerName: string;
  lastUpdated: string;
  progress: string;
  isLate: boolean;
}

interface CompactedWorkOrder {
  workOrderNumber: string;
  executionStage: string;
  lastUpdated: string;
  progress: string;
  isLate: boolean;
}

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayerOneComponent extends LayerOneRouter implements OnInit {
  private placeholder$ = new BehaviorSubject<boolean>(true);
  private rowCount = 6;
  private chunkLineItems = 3;
  private salesOrderAggregates: SalesOrderAggregate[];
  private cacheDiscardedSource: number | undefined;
  public isLoading = true;
  public salesOrderCols: ColumnSetting[] = [
    { title: 'SALES ORDER NO.', field: 'salesOrderNumber', width: 450 },
    { title: 'CUSTOMER NAME', field: 'customerName' },
    { title: 'LAST UPDATED', field: 'lastUpdated', width: 370 },
  ];
  public workOrderCols: ColumnSetting[] = [
    { title: 'WORK ORDER NO.', field: 'workOrderNumber', width: 450 },
    { title: 'PROCESS STAGE', field: 'executionStage' },
    { title: 'LAST UPDATED', field: 'lastUpdated', width: 370 },
  ];
  public salesOrderData: CompactedSalesOrder[];
  public workOrderData: CompactedWorkOrder[];
  public getWidth = getWidth;

  constructor(
    protected override route: Router,
    protected override zone: NgZone,
    protected override app: AppService,
    private notif: NotificationService,
    private pt: ProductionTrackingService
  ) {
    super(route, zone, app);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    filterStreamsFromWebsocketGateway$(this.app.wsGateway$, []).subscribe({
      next: msg => {
        // For any updates, to refetch.
        if (msg.data) {
          console.log(JSON.parse(msg.data));
        }
        this.cacheRequestFromWebsocket();
        this.placeholder$.next(true);
      },
    });

    this.placeholder$
      .pipe(
        exhaustMap(_ => {
          // Since this is a bulk request of SalesOrders, to fetch all WorkOrderFamilies
          // in parallel instead of querying by WoId synchronously.
          // For ExhaustMap, new source observables will be discarded.
          const parallelRequests = {
            salesOrders: this.pt.fetchSalesOrdersFromRps$(this.app.factory()),
            workOrderFamilies: this.pt.fetchWorkOrderFamilies$(this.app.factory()),
          };
          return forkJoin(parallelRequests);
        }),
        switchMap(res => {
          const salesOrders = res.salesOrders.slice(0, this.rowCount);
          const parallelSalesOrders = salesOrders.map(row =>
            this.aggregateSalesOrderByLineItemsWithErrorWrapper(row, res.workOrderFamilies)
          );
          return forkJoin(parallelSalesOrders);
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe({
        next: res => {
          this.salesOrderAggregates = res;
          this.isLoading = false;
          this.salesOrderData = [];
          this.workOrderData = [];
          this.displayCompactedSalesOrdersAndWorkOrders(res);
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private cacheRequestFromWebsocket() {
    // ExhaustMap will discard new source observables, and this may result
    // in latest updates being missed.
    // To cache them with setTimeout and ensure latest changes are reflected.
    if (!this.cacheDiscardedSource) {
      this.cacheDiscardedSource = window.setTimeout(() => {
        this.placeholder$.next(true);
        this.cacheDiscardedSource = undefined;
      }, 30000);
    }
  }

  private aggregateSalesOrderByLineItemsWithErrorWrapper(row: RpsSalesOrder, workOrderFamilies: RpsWorkOrder[]) {
    // When a SalesOrder fails to load, to return an incomplete SalesOrderAggregate,
    // instead of throwing an error.
    return this.pt
      .aggregateSalesOrderByLineItems$(row, this.chunkLineItems, workOrderFamilies)
      .pipe(catchError(() => of(this.constructSalesOrderAggregate(row))));
  }

  private displayCompactedSalesOrdersAndWorkOrders(salesOrderAggregates: SalesOrderAggregate[]) {
    salesOrderAggregates.forEach(row => {
      // add SalesOrders.
      this.addCompactedSalesOrder(row);

      // Get WorkOrders, sorted by SalesOrders.
      for (const lineItem of row.lineItemAggregates) {
        if (this.workOrderData.length === this.rowCount) return;
        this.addCompactedWorkOrdersForEachSalesOrder(lineItem.workOrderAggregates, row.salesOrderNumber);
      }
    });
  }

  private addCompactedSalesOrder(so: SalesOrderAggregate) {
    const temp: CompactedSalesOrder = {
      customerName: so.customerName,
      salesOrderNumber: so.salesOrderNumber,
      isLate: this.isLatePredicate(so),
      lastUpdated: this.formatDisplayedTime(so.lastUpdated),
      progress: this.formatProgress(so.progress),
    };
    this.salesOrderData.push(temp);
  }

  private addCompactedWorkOrdersForEachSalesOrder(workOrderAggregates: WorkOrderAggregate[], salesOrderNumber: string) {
    for (const row of workOrderAggregates) {
      const workOrder: CompactedWorkOrder = {
        workOrderNumber: this.formatWorkOrderNumber(row.workOrderNumber, salesOrderNumber),
        executionStage: row.executionStage || '-',
        lastUpdated: this.formatDisplayedTime(row.lastUpdated),
        progress: this.formatProgress(row.progress),
        isLate: this.isLatePredicate(row),
      };
      this.workOrderData.push(workOrder);
      if (this.workOrderData.length === this.rowCount) return;
    }
  }

  private formatDisplayedTime(v: string) {
    return moment(v).format('DD/MM/YYYY HH:mm:ss');
  }

  public formatProgress(v?: number) {
    if (!v) return '0%';
    return `${v}%`;
  }

  private compareDate(a: string, b: string) {
    // Descending order.
    const aDate = new Date(a);
    const bDate = new Date(b);
    if (aDate.getTime() < bDate.getTime()) return 1;
    return -1;
  }

  private constructSalesOrderAggregate(salesOrder: RpsSalesOrder) {
    return {
      ...salesOrder,
      estimatedCompleteDate: salesOrder.dueDate,
      lastUpdated: salesOrder.orderDate,
      lineItemAggregates: [],
      releasedQty: 0,
      completedQty: 0,
      progress: 0,
      totalProcesses: 0,
      completedProcesses: 0,
    } as SalesOrderAggregate;
  }

  private isLatePredicate(data: StatusAggregate) {
    const time1 = new Date(data.estimatedCompleteDate as string).getTime();
    const time2 = data.completedDate ? new Date(data.completedDate).getTime() : Date.now();
    if (time1 - time2 > 0) return false;
    return true;
  }

  private formatWorkOrderNumber(workOrderNumber: string, salesOrderNumber: string) {
    return `${salesOrderNumber}/${workOrderNumber.substring(6)}`;
  }
}
