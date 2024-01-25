import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ColumnSetting } from '@core/models/grid.model';
import { AppService } from '@core/services/app.service';
import { SalesOrderStatus, WorkOrderStatus } from '@pt/production-tracking.model';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { CancelSubscription } from '@shared/classes/cancel-subscription.class';
import { switchMap, take } from 'rxjs';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayerOneComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public circleError = 'assets/images/utilities/circle-error.png';
  public circleSuccess = 'assets/images/utilities/circle-success.png';

  public salesOrderCols: ColumnSetting[] = [
    { title: 'SALES ORDER NO.', field: 'salesOrderNo' },
    { title: 'CUSTOMER NAME', field: 'customer' },
    { title: 'LAST UPDATED', field: 'lastUpdated' },
  ];
  public workOrderCols: ColumnSetting[] = [
    { title: 'WORK ORDER NO.', field: 'workOrderNo' },
    { title: 'PROCESS STAGE', field: 'processStage' },
    { title: 'LAST UPDATED', field: 'lastUpdated' },
  ];
  public salesOrderData: SalesOrderStatus[] = [
    {
      salesOrderNo: 'EX-240124-0001',
      customer: 'This is some very long message This is some very long message This is some very long message',
      status: '0%',
      lastUpdated: '24/01/2024 09:39:05',
      isLate: true,
    },
    { salesOrderNo: 'EX-240124-0001', customer: 'VIP', status: '0%', lastUpdated: '24/01/2024 09:39:05' },
    { salesOrderNo: 'EX-240124-0001', customer: 'VIP', status: '0%', lastUpdated: '24/01/2024 09:39:05' },
    { salesOrderNo: 'EX-240124-0001', customer: 'VIP', status: '0%', lastUpdated: '24/01/2024 09:39:05' },
    { salesOrderNo: 'EX-240124-0001', customer: 'VIP', status: '0%', lastUpdated: '24/01/2024 09:39:05' },
  ];
  public workOrderData: WorkOrderStatus[] = [
    {
      workOrderNo: 'EX-240124-0001',
      processStage: 'VIP',
      status: '0%',
      lastUpdated: '24/01/2024 09:39:05',
      isLate: true,
    },
    { workOrderNo: 'EX-240124-0001', processStage: 'VIP', status: '0%', lastUpdated: '24/01/2024 09:39:05' },
    { workOrderNo: 'EX-240124-0001', processStage: 'VIP', status: '0%', lastUpdated: '24/01/2024 09:39:05' },
    { workOrderNo: 'EX-240124-0001', processStage: 'VIP', status: '0%', lastUpdated: '24/01/2024 09:39:05' },
    { workOrderNo: 'EX-240124-0001', processStage: 'VIP', status: '0%', lastUpdated: '24/01/2024 09:39:05' },
  ];

  constructor(
    private app: AppService,
    private pt: ProductionTrackingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.app.factory$.pipe(
      take(1),
      switchMap(res => {
        return this.pt.fetchSalesOrders$(res);
      })
    );
  }
}
