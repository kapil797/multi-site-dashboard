import { Component, NgZone, OnInit } from '@angular/core';
import { Subject, forkJoin, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { createNotif } from '@core/utils/notification';
import { periods } from '@core/constants/period.constant';
import { getRandomNumber } from '@core/utils/formatters';
import { LayerOneRouter } from '@core/classes/layer-one-router/layer-one-router.class';
import { ProductionAndInventoryService } from '@pi/production-and-inventory.service';
import { InventoryPerformance } from '@pi/production-and-inventory.model';
import { PeriodPerformance } from '@pi/components/progress-performance/progress-performance.component';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends LayerOneRouter implements OnInit {
  public isLoading = true;
  public periods = periods;
  public inventoryPerformanceData: InventoryPerformance;
  public workOrderPerformanceData: PeriodPerformance;
  public productionYieldPerformanceData: PeriodPerformance;
  private sub$ = new Subject();

  constructor(
    protected override zone: NgZone,
    protected override route: Router,
    protected override app: AppService,
    private notif: NotificationService,
    private pi: ProductionAndInventoryService
  ) {
    super(route, zone, app);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.sub$
      .pipe(
        switchMap(_ => {
          return forkJoin({
            inventoryPerformance: this.pi.fetchInventoryPerformance$(this.app.factory()),
          });
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe({
        next: res => {
          this.isLoading = false;
          // For overall, to take the first item.
          this.inventoryPerformanceData = res.inventoryPerformance;

          this.workOrderPerformanceData = this.generatePeriodPerformance();
          this.productionYieldPerformanceData = this.generatePeriodPerformance();
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

  private generatePeriodPerformance() {
    const data: PeriodPerformance = {
      pastPeriod: getRandomNumber(40, 100),
      currentPeriod: getRandomNumber(40, 100),
      projectedPeriod: getRandomNumber(40, 100),
    };
    return data;
  }
}
