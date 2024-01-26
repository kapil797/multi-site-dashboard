import { Component, OnInit } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@shared/classes/cancel-subscription.class';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { createNotif } from '@core/utils/notif';
import { Execution, Product } from '@pt/production-tracking.model';

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent extends CancelSubscription implements OnInit {
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
      ],
    },
    {
      name: 'MfConnect',
      processes: [
        'Laser Wielding',
        'Cartridge Screen Printing',
        'Cartridge Oven 1',
        'Screen Printing Silicon',
        'Cartridge Oven 2',
        'Cartridge Oven 3',
        'Laser Printing',
      ],
    },
  ];
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
