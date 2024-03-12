import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject, forkJoin, switchMap, take, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { ResourceHealthService } from '@rh/resource-health.service';
import { AggregatedResourceConsumption, Period } from '@rh/resource-health.model';
import { AppService } from '@core/services/app.service';
import { SeriesDataItem, chartConfig } from '@core/models/charts.model';

interface ChartData {
  categories: string[];
  series1: SeriesDataItem[];
  series2: number[];
}

interface InputArgs {
  period: Period;
  machine: string;
}

@Component({
  selector: 'app-machine-consumption',
  templateUrl: './machine-consumption.component.html',
  styleUrl: './machine-consumption.component.scss',
})
export class MachineConsumptionComponent extends CancelSubscription implements OnInit, OnChanges {
  @Input() period: Period;
  @Input() machines: string[];
  public isLoading = true;
  public chartConfig = chartConfig;
  public inputArgs$ = new ReplaySubject<InputArgs>();
  public energyConsumptionData: ChartData;
  public wasteConsumptionData: ChartData;
  public crossingValues = [0, 5];
  public dropdownValue: string;

  constructor(
    private rt: ResourceHealthService,
    private app: AppService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.inputArgs$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap(res => {
          return forkJoin([
            this.rt.fetchMachineEnergyConsumption$(this.app.factory(), res.period, res.machine),
            this.rt.fetchMachineWasteConsumption$(this.app.factory(), res.period, res.machine),
          ]);
        })
      )
      .subscribe({
        next: res => {
          this.energyConsumptionData = this.mapToChartData(res[0]);
          this.wasteConsumptionData = this.mapToChartData(res[1]);
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['machines']) {
      // Select first machine on init.
      this.inputArgs$.next({ period: this.period, machine: this.machines[0] });
      this.dropdownValue = this.machines[0];
    } else if (changes['period']) {
      this.inputArgs$.pipe(take(1)).subscribe(res => this.inputArgs$.next({ ...res, period: this.period }));
    }
  }

  public onToggleMachine(event: string) {
    this.inputArgs$.pipe(take(1)).subscribe(res => this.inputArgs$.next({ ...res, machine: event }));
  }

  private mapToChartData(data: AggregatedResourceConsumption[]) {
    const result: ChartData = {
      categories: [],
      series1: [],
      series2: [],
    };
    data.forEach(row => {
      result.categories.push(row.periodRange);
      result.series1.push(this.mapSeriesItem(row.generationIntensity));
      result.series2.push(row.amount);
    });
    return result;
  }

  private mapSeriesItem(v: number) {
    let color: string = chartConfig.error;
    if (v <= 0.08) color = chartConfig.success;
    else if (v <= 0.14) color = chartConfig.warning;
    return {
      color,
      yValue: v,
    } as SeriesDataItem;
  }
}
