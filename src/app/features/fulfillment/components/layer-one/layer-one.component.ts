import { Component, NgZone, OnInit } from '@angular/core';
import { forkJoin, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { createNotif } from '@core/utils/notification';
import { LayerOneRouter } from '@core/classes/layer-one-router/layer-one-router.class';
import { FulfillmentService } from '@ful/fulfillment.service';
import { DemandProfile } from '@ful/fulfillment.model';

interface DemandProfiles {
  eScentz: DemandProfile;
  mfConnectPlus: DemandProfile;
}

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends LayerOneRouter implements OnInit {
  public isLoading = true;
  public demandProfiles: DemandProfiles;

  constructor(
    protected override route: Router,
    protected override zone: NgZone,
    protected override app: AppService,
    private dp: FulfillmentService,
    private notif: NotificationService
  ) {
    super(route, zone, app);
  }

  override ngOnInit(): void {
    super.ngOnInit();
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
