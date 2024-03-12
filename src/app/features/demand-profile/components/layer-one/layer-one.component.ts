import { Component, OnInit } from '@angular/core';
import { forkJoin, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { DemandProfileService } from '@dp/demand-profile.service';
import { DemandProfile } from '@dp/demand-profile.model';

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

  constructor(
    private app: AppService,
    private dp: DemandProfileService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
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
