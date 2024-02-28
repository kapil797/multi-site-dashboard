import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, forkJoin, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';
import moment from 'moment';

import { ColumnSetting } from '@core/models/grid.model';
import { AppService } from '@core/services/app.service';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { SalesOrderAggregate } from '@pt/production-tracking.model';

/*
  Total maximum number of parallel requests:
  - 6 SalesOrders
    - 3 LineItems for each SalesOrder
      - 5 Executions for each LineItem
  Total: 6*3*5 = 90 (to optimize as required).
*/

interface Status {
  status?: string;
  isLate?: boolean;
  lastUpdated?: string;
}

interface WorkOrderStatus extends Status {
  workOrderNo: string;
  processStage: string;
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
  private topSalesOrderNumber = 6;
  private chunkLineItems = 3;

  public salesOrderCols: ColumnSetting[] = [
    { title: 'SALES ORDER NO.', field: 'salesOrderNumber' },
    { title: 'CUSTOMER NAME', field: 'customerName' },
    { title: 'LAST UPDATED', field: 'lastUpdated' },
  ];
  public workOrderCols: ColumnSetting[] = [
    { title: 'WORK ORDER NO.', field: 'workOrderNo' },
    { title: 'PROCESS STAGE', field: 'processStage' },
    { title: 'LAST UPDATED', field: 'lastUpdated' },
  ];
  public salesOrderAggData: SalesOrderAggregate[];
  public workOrderData: WorkOrderStatus[];

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
          const salesOrders = res.salesOrders.slice(0, this.topSalesOrderNumber);
          const parallelSalesOrders = salesOrders.map(row =>
            this.pt.aggregateSalesOrderByLineItems$(row, this.chunkLineItems, res.workOrderFamilies)
          );
          return forkJoin(parallelSalesOrders);
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe({
        next: res => {
          const soData = res.map(row => {
            row.customerName = row.customerName.toUpperCase();
            row.lastUpdated = this.formatDisplayedTime(row.lastUpdated);
            return row;
          });
          soData.sort((a, b) => this.compareDate(a.lastUpdated, b.lastUpdated));
          this.salesOrderAggData = soData;
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private formatDisplayedTime(v: string) {
    return moment(v).format('DD/MM/YYYY HH:mm:ss');
  }

  private compareDate(a: string, b: string) {
    // Descending order.
    const aDate = new Date(a);
    const bDate = new Date(b);
    if (aDate.getTime() < bDate.getTime()) return 1;
    return -1;
  }
}
