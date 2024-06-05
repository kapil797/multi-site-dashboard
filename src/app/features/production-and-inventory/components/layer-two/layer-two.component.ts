import { Component, OnInit } from '@angular/core';
import { Subject, forkJoin, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';

import { periods } from '@core/constants/period.constant';
import { ProductionAndInventoryService } from '@pi/production-and-inventory.service';
import { InventoryPerformance, ProductionPerformance } from '@pi/production-and-inventory.model';

interface ProductionCategories {
  cycleTimeDeviation: ProductionPerformance[];
  productionYield: ProductionPerformance[];
  spareCapacity: ProductionPerformance[];
}

interface InventoryCategories {
  rawMaterial: InventoryPerformance;
  overall: InventoryPerformance;
  mts: InventoryPerformance;
}

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public periods = periods;
  public productionCategories: ProductionCategories;
  public inventoryCategories: InventoryCategories;
  private sub$ = new Subject();

  constructor(
    private app: AppService,
    public pi: ProductionAndInventoryService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub$
      .pipe(
        switchMap(_ => {
          return forkJoin({
            cycleTimeDeviation: this.pi.fetchProductionPerformance$(this.app.factory()),
            productionYield: this.pi.fetchProductionPerformance$(this.app.factory()),
            spareCapacity: this.pi.fetchProductionPerformance$(this.app.factory()),
            rawMaterial: this.pi.fetchInventoryPerformance$(this.app.factory()),
            mts: this.pi.fetchInventoryPerformance$(this.app.factory()),
            overall: this.pi.fetchInventoryPerformance$(this.app.factory()),
          });
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.productionCategories = {
            cycleTimeDeviation: res.cycleTimeDeviation,
            productionYield: res.productionYield,
            spareCapacity: res.spareCapacity,
          };

          this.inventoryCategories = {
            rawMaterial: res.rawMaterial,
            overall: res.overall,
            mts: res.mts,
          };
        },
        error: (error: Error) => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error.message));
        },
      });

    this.onTogglePeriod(null);
  }

  public onTogglePeriod(_event: unknown) {
    this.sub$.next(1);
  }
}
