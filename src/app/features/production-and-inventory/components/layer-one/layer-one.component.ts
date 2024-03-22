import { Component, NgZone, OnDestroy, OnInit, effect } from '@angular/core';
import { Subject, forkJoin, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { ProductionAndInventoryService } from '@pi/production-and-inventory.service';
import { periods } from '@core/constants/period.constant';
import { InventoryPerformance } from '@pi/production-and-inventory.model';
import { PeriodPerformance } from '@pi/components/progress-performance/progress-performance.component';
import { changeFactoryInUrl, getRandomNumber } from '@core/utils/formatters';
import { Factory } from '@core/models/factory.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends CancelSubscription implements OnInit, OnDestroy {
  public isLoading = true;
  public periods = periods;
  public inventoryPerformanceData: InventoryPerformance;
  public workOrderPerformanceData: PeriodPerformance;
  public productionYieldPerformanceData: PeriodPerformance;
  public isOverlay: boolean;
  private sub$ = new Subject();
  private bc = new BroadcastChannel('factoryChannel');

  constructor(
    private app: AppService,
    public pi: ProductionAndInventoryService,
    private notif: NotificationService,
    private zone: NgZone,
    private route: Router
  ) {
    super();

    effect(() => {
      if (this.app.factory() === Factory.MICRO_FACTORY) {
        this.isOverlay = true;
      } else {
        this.isOverlay = false;
      }
    });
  }

  ngOnInit(): void {
    this.bc.onmessage = event => {
      this.zone.run(() => {
        this.route.navigate(changeFactoryInUrl(this.route, event.data), {
          queryParams: this.route.routerState.snapshot.root.children[0].queryParams,
          queryParamsHandling: 'merge',
        });
      });
    };

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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.bc.close();
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
