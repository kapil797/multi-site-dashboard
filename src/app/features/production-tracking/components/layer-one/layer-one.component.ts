import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';
import moment from 'moment';

import { ColumnSetting, getWidth } from '@core/models/grid.model';
import { AppService } from '@core/services/app.service';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import {
  RpsWorkOrder,
  SalesOrder,
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

interface MinSalesOrder {
  salesOrderNumber: string;
  customerName: string;
  lastUpdated: string;
  progress: string;
  isLate: boolean;
}

interface MinWorkOrder {
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
export class LayerOneComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  private placeholder$ = new BehaviorSubject<boolean>(true);
  private rowCount = 6;
  private chunkLineItems = 3;

  public salesOrderCols: ColumnSetting[] = [
    { title: 'SALES ORDER NO.', field: 'salesOrderNumber', width: 450 },
    { title: 'CUSTOMER NAME', field: 'customerName' },
    { title: 'LAST UPDATED', field: 'lastUpdated', width: 450 },
  ];
  public workOrderCols: ColumnSetting[] = [
    { title: 'WORK ORDER NO.', field: 'workOrderNumber', width: 450 },
    { title: 'PROCESS STAGE', field: 'executionStage' },
    { title: 'LAST UPDATED', field: 'lastUpdated', width: 450 },
  ];
  public salesOrderData: MinSalesOrder[];
  public workOrderData: MinWorkOrder[];
  public getWidth = getWidth;

  constructor(
    private app: AppService,
    private notif: NotificationService,
    private pt: ProductionTrackingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.placeholder$
      .pipe(
        switchMap(_ => {
          // Since this is a bulk request of SalesOrders, to fetch all WorkOrderFamilies
          // in parallel instead of querying by WoId synchronously.
          const parallelRequests = {
            salesOrders: this.pt.fetchSalesOrders$(this.app.factory(), 6),
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
          this.isLoading = false;
          this.salesOrderData = [];
          this.workOrderData = [];

          res.sort((a, b) => this.compareDate(a.lastUpdated, b.lastUpdated));
          res.forEach(row => {
            // Get SalesOrders.
            const temp: MinSalesOrder = {
              customerName: row.customerName.toUpperCase(),
              salesOrderNumber: row.salesOrderNumber,
              isLate: this.isLatePredicate(row),
              lastUpdated: this.formatDisplayedTime(row.lastUpdated),
              progress: this.formatProgress(row.progress),
            };
            this.salesOrderData.push(temp);

            // Get WorkOrders, sorted by SalesOrders.
            for (const lineItem of row.lineItemAggregates) {
              if (this.workOrderData.length === this.rowCount) return;
              this.populateMinWorkOrders(lineItem.workOrderAggregates);
            }
          });
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private aggregateSalesOrderByLineItemsWithErrorWrapper(row: SalesOrder, workOrderFamilies: RpsWorkOrder[]) {
    // When a SalesOrder fails to load, to return an incomplete SalesOrderAggregate,
    // instead of throwing an error.
    return this.pt
      .aggregateSalesOrderByLineItems$(row, this.chunkLineItems, workOrderFamilies)
      .pipe(catchError(() => of(this.constructSalesOrderAggregate(row))));
  }

  private populateMinWorkOrders(workOrderAggregates: WorkOrderAggregate[]) {
    for (const row of workOrderAggregates) {
      const workOrder: MinWorkOrder = {
        workOrderNumber: row.workOrderNumber,
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

  private constructSalesOrderAggregate(salesOrder: SalesOrder) {
    return {
      ...salesOrder,
      lastUpdated: salesOrder.createdDate,
      lineItemAggregates: [],
      releasedQty: 0,
      completedQty: 0,
      progress: 0,
    } as SalesOrderAggregate;
  }

  private isLatePredicate(data: StatusAggregate) {
    const time1 = new Date(data.estimatedCompleteDate as string).getTime();
    const time2 = data.completedDate ? new Date(data.completedDate).getTime() : Date.now();
    if (time1 - time2 > 0) return false;
    return true;
  }
}
