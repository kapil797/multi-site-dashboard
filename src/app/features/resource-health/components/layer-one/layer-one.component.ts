import { Component, NgZone, OnInit, effect } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { periods } from '@core/constants/period.constant';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { ResourceHealthService } from '@rh/resource-health.service';
import { OverallResourceHealth } from '@rh/resource-health.model';
import { Router } from '@angular/router';
import { changeFactoryInUrl } from '@core/utils/formatters';
import { Factory } from '@core/models/factory.model';
import {
  WsFactoryDisplayStream,
  consumerStreams,
  filterStreamFromWebsocketGateway$,
} from '@core/models/websocket.model';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public data: OverallResourceHealth[];
  public periods = periods;
  public isOverlay: boolean;
  private sub$ = new Subject();

  constructor(
    private app: AppService,
    private route: Router,
    public rt: ResourceHealthService,
    private notif: NotificationService,
    private zone: NgZone
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
    filterStreamFromWebsocketGateway$(this.app.wsGateway$, consumerStreams.FACTORY_DISPLAY).subscribe(res => {
      const msg = res.data as WsFactoryDisplayStream;
      this.zone.run(() => {
        this.route.navigate(changeFactoryInUrl(this.route, msg.factory), {
          queryParams: this.route.routerState.snapshot.root.children[0].queryParams,
          queryParamsHandling: 'merge',
        });
      });
    });

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
