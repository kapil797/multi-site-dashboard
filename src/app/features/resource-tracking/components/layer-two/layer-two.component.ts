import { Component, OnInit } from '@angular/core';
import { forkJoin, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { Factory } from '@core/models/factory.model';
import { CancelSubscription } from '@shared/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@shared/configs/notification';
import { ResourceTrackingService } from '@rt/resource-tracking.service';
import { MachineStatus, TrackedMachine } from '@rt/resource-tracking.model';

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public machinesStatus: MachineStatus[];
  public factory: Factory;
  public trackedMachine: TrackedMachine;

  constructor(
    private app: AppService,
    private rt: ResourceTrackingService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.app.factory$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(res => {
          this.factory = res;
          return this.rt.fetchMachinesStatus$(res);
        })
      )
      .subscribe({
        next: res => {
          this.isLoading = false;

          // For layout plan.
          this.machinesStatus = res;

          // Select first machine.
          if (res.length > 0) this.onChangeMachine(res[0]);
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });
  }

  public onChangeMachine(event: MachineStatus) {
    const requests$ = {
      resourceData: this.rt.fetchMachineResourceConsumption$(this.factory, event),
      alertHistoryData: this.rt.fetchMachineAlertHistory$(this.factory, event),
    };

    forkJoin(requests$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.trackedMachine = {
            metadata: event,
            resourceData: res.resourceData,
            alertHistoryData: res.alertHistoryData,
          };
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });
  }
}
