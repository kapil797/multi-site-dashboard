import { Component, NgZone, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { periods } from '@core/constants/period.constant';
import { createNotif } from '@core/utils/notification';
import { LayerOneRouter } from '@core/classes/layer-one-router/layer-one-router.class';
import { ResourceHealthService } from '@rh/resource-health.service';
import { OverallResourceHealth } from '@rh/resource-health.model';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends LayerOneRouter implements OnInit {
  public isLoading = true;
  public data: OverallResourceHealth[];
  public periods = periods;
  private sub$ = new Subject();

  constructor(
    protected override route: Router,
    protected override zone: NgZone,
    protected override app: AppService,
    private rt: ResourceHealthService,
    private notif: NotificationService
  ) {
    super(route, zone, app);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.sub$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap(_res => {
          return this.rt.fetchOverallResourceHealth$(this.app.factory());
        })
      )
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.data = res;
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });

    this.onTogglePeriod(null);
  }

  public onTogglePeriod(_event: unknown) {
    this.sub$.next(1);
  }
}
