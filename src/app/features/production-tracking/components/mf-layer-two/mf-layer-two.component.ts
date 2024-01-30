import { Component, OnInit } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@shared/classes/cancel-subscription/cancel-subscription.class';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { createNotif } from '@shared/configs/notification';
import { Execution, Product } from '@pt/production-tracking.model';
import { SalesOrderData } from '@pt/components/sales-order-details/sales-order-details.component';

@Component({
  selector: 'app-layer-two',
  templateUrl: './mf-layer-two.component.html',
  styleUrl: './mf-layer-two.component.scss',
})
export class MfLayerTwoComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public salesOrders: string[];
  public products: Product[] = [
    {
      name: 'eScentz (MTS)',
      processes: [
        'Laser Wielding',
        'Cartridge Screen Printing',
        'Cartridge Oven 1',
        'Screen Printing Silicon',
        'Cartridge Oven 2',
        'Cartridge Oven 3',
        'Laser Printing',
        'Screen Printing Silicon',
        'Cartridge Oven 2',
        'Cartridge Oven 3',
        'Laser Printing',
      ],
    },
    {
      name: 'MfConnect',
      processes: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'],
    },
  ];
  public salesOrderData: SalesOrderData = {
    progress: 80,
    customer: 'Some customer',
    salesOrderNo: 'EX191108-0001',
    dueDate: '2024-01-29T11:35:16.43',
    lineItems: [
      { name: 'E-Scentz Mold Insert', quantity: 2 },
      { name: 'E-Scentz Mold Insert', quantity: 1 },
      { name: 'E-Scentz Mold Insert', quantity: 5 },
    ],
  };

  private factory: string;

  constructor(
    private app: AppService,
    private pt: ProductionTrackingService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.app.factory$
      .pipe(
        switchMap(res => {
          this.factory = res;
          return this.pt.fetchSalesOrders$(res);
        }),
        switchMap(res => {
          this.salesOrders = res.map(row => row.salesOrderNo);
          // Auto fetch the details for first sales order if any.
          if (this.salesOrders.length > 0) this.fetchSalesOrderAggregate$(this.salesOrders[0]);
          return of([] as Execution[]);
        })
      )
      .subscribe({
        next: _res => {
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private fetchSalesOrderAggregate$(salesOrderId: string) {
    return this.pt.fetchWorkOrders$(this.factory, [salesOrderId]).pipe(
      switchMap(res => {
        return this.pt.fetchExecutions$(
          this.factory,
          res.map(row => row.workOrderNumber)
        );
      })
    );
  }
}
