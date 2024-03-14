import { Component, OnInit } from '@angular/core';
import { Subject, forkJoin, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { periods } from '@core/constants/period.constant';
import { ResourceHealthService } from '@rh/resource-health.service';
import { AggregatedResourceConsumption, MachineResourceHealth, Period } from '@rh/resource-health.model';

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
  public machine: string;
  public periods = periods;
  public energyConsumptionData: AggregatedResourceConsumption[];
  public wasteConsumptionData: AggregatedResourceConsumption[];
  private periodPlaceholder$ = new Subject();
  private machinePlaceholder$ = new Subject();

  constructor(
    private app: AppService,
    public rt: ResourceHealthService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.periodPlaceholder$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap(_res => {
          return this.rt.fetchMachinesResourceHealth$(this.app.factory());
        })
      )
      .subscribe({
        next: res => {
          this.gridData = res;
          // Machines will not change for every change in period.
          if (!this.machines) {
            this.machines = this.mapMachines(res);
            this.machine = this.machines[0];
          }
          this.machinePlaceholder$.next(true);
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });

    this.machinePlaceholder$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap(_res => {
          return forkJoin({
            energy: this.rt.fetchMachineEnergyConsumption$(this.app.factory(), this.period, this.machine),
            waste: this.rt.fetchMachineWasteConsumption$(this.app.factory(), this.period, this.machine),
          });
        })
      )
      .subscribe({
        next: res => {
          this.energyConsumptionData = res.energy;
          this.wasteConsumptionData = res.waste;
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
    this.periodPlaceholder$.next(true);
  }

  private mapMachines(data: MachineResourceHealth[]) {
    return data.reduce((prev, cur) => {
      if (cur.name.toUpperCase() === 'OVERALL') return prev;
      prev.push(cur.name.toUpperCase());
      return prev;
    }, [] as string[]);
  }

  public onToggleMachine(_event: string) {
    this.machinePlaceholder$.next(true);
  }
}
