import { Component, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { Factory } from '@core/models/factory.model';
import { CancelSubscription } from '@shared/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@shared/configs/notification';
import { ResourceHealthService } from '@rh/resource-health.service';
import { OverallResourceHealth } from '@rh/resource-health.model';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public factory: Factory;
  public data: OverallResourceHealth[];
  private sub$ = new Subject();

  constructor(
    private app: AppService,
    public rt: ResourceHealthService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(_res => {
          return this.app.factory$;
        }),
        switchMap(res => {
          this.factory = res;
          return this.rt.fetchOverallResourceHealth$(res);
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
