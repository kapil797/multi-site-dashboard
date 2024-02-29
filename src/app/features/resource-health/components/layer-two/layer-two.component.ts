import { Component, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { ResourceHealthService } from '@rh/resource-health.service';
import { MachineResourceHealth, Period } from '@rh/resource-health.model';

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public gridData: MachineResourceHealth[];
  public period: Period;
  public machines: string[];
  private placeholder$ = new Subject();

  constructor(
    private app: AppService,
    public rt: ResourceHealthService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.placeholder$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(_res => {
          return this.rt.fetchMachinesResourceHealth$(this.app.factory());
        })
      )
      .subscribe({
        next: res => {
          this.gridData = res;
          // Machines will not change for every change in period.
          if (!this.machines) this.machines = this.mapMachines(res);
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });

    this.onTogglePeriod('WEEKLY');
  }

  public onTogglePeriod(event: unknown) {
    this.period = event as Period;
    this.placeholder$.next(1);
  }

  private mapMachines(data: MachineResourceHealth[]) {
    return data.reduce((prev, cur) => {
      if (cur.name.toUpperCase() === 'OVERALL') return prev;
      prev.push(cur.name.toUpperCase());
      return prev;
    }, [] as string[]);
  }
}
