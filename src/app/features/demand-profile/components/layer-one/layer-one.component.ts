import { Component, NgZone, OnDestroy, OnInit, effect } from '@angular/core';
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

interface DemandProfiles {
  eScentz: DemandProfile;
  mfConnectPlus: DemandProfile;
}

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends CancelSubscription implements OnInit, OnDestroy {
  public isLoading = true;
  public demandProfiles: DemandProfiles;
  public isOverlay: boolean;
  private bc = new BroadcastChannel('factoryChannel');

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
    this.bc.onmessage = event => {
      this.zone.run(() => {
        this.route.navigate(changeFactoryInUrl(this.route, event.data), {
          queryParams: this.route.routerState.snapshot.root.children[0].queryParams,
          queryParamsHandling: 'merge',
        });
      });
    };

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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.bc.close();
  }
}
