import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import moment from 'moment';

import { getRandomInt } from '@core/utils/formatters';
import { MachineAlertHistory, MachineStatus, ResourceConsumption } from '@rt/resource-tracking.model';
import { SeriesDataItem, chartConfig } from '@core/models/charts.model';

@Component({
  selector: 'app-resource-consumption',
  templateUrl: './resource-consumption.component.html',
  styleUrl: './resource-consumption.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ResourceConsumptionComponent implements OnChanges {
  @Input() metadata: MachineStatus;
  @Input() resourceData: ResourceConsumption[];
  @Input() alertHistoryData: MachineAlertHistory[];
  public title: string;
  public lastUpdated: string;
  public categories: Date[];
  public series: SeriesDataItem[];
  public waste: number;
  public chartConfig = chartConfig;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resourceData']) {
      this.title = this.metadata.name;
      this.lastUpdated = this.formatDateWithoutTime(this.resourceData[0].receivedDate);
      this.constructResourceSeriesAndCategories();
      this.waste = getRandomInt(0, 100);
    }
  }

  private constructResourceSeriesAndCategories() {
    this.categories = [];
    this.series = [];
    this.resourceData.forEach(row => {
      this.categories.push(new Date(row.receivedDate));
      const item: SeriesDataItem = {
        yValue: row.powerLoad,
        color: this.setBarColorByWindowedModeAndThreshold(row),
      };
      this.series.push(item);
    });
  }

  private setBarColorByWindowedModeAndThreshold(data: ResourceConsumption) {
    if (data.windowedMode === 1) return this.chartConfig.neutral;
    const threshold = data.windowedMode === 3 ? this.metadata.productionThreshold : this.metadata.idlingThreshold;
    if (data.powerLoad < threshold.eGreen) return this.chartConfig.success;
    else if (data.powerLoad > threshold.eRed) return this.chartConfig.error;
    return this.chartConfig.warning;
  }

  public formatDateWithoutTime(v: string) {
    return moment(v).format('DD/MM/YYYY');
  }

  public formatDateToTime(v: string) {
    return moment(v).format('HH:mm:ss');
  }
}
