import { Component, NgZone, OnInit, effect } from '@angular/core';
import { forkJoin, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { DemandProfileService } from '@dp/demand-profile.service';
import { DemandProfile } from '@dp/demand-profile.model';
import { Factory } from '@core/models/factory.model';
import { changeFactoryInUrl } from '@core/utils/formatters';
import { Router } from '@angular/router';
import {
  WsFactoryDisplayStream,
  consumerStreams,
  filterStreamFromWebsocketGateway$,
} from '@core/models/websocket.model';

interface DemandProfiles {
  eScentz: DemandProfile;
  mfConnectPlus: DemandProfile;
}

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public demandProfiles: DemandProfiles;
  public isOverlay: boolean;

  constructor(
    private app: AppService,
    private dp: DemandProfileService,
    private notif: NotificationService,
    private route: Router,
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

    forkJoin({
      eScentz: this.dp.fetchDemandProfile$(this.app.factory(), 'ESCENTZ', 3),
      mfConnectPlus: this.dp.fetchDemandProfile$(this.app.factory(), 'MFCONNECT+', 3),
    })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.demandProfiles = res;
        },
        error: (error: Error) => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error.message));
        },
      });
  }
}
