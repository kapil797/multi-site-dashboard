import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { AggregatedResourceConsumption } from '@rh/resource-health.model';
import { SeriesDataItem, chartConfig } from '@core/models/charts.model';

interface ChartData {
  categories: string[];
  series1: SeriesDataItem[];
  series2: number[];
}

@Component({
  selector: 'app-machine-consumption',
  templateUrl: './machine-consumption.component.html',
  styleUrl: './machine-consumption.component.scss',
})
export class MachineConsumptionComponent implements OnChanges {
  @Input() title: string;
  @Input() data: AggregatedResourceConsumption[];
  public chartData: ChartData;
  public chartConfig = chartConfig;
  public crossingValues = [0, 5];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.chartData = this.mapToChartData();
    }
  }

  private mapToChartData() {
    const result: ChartData = {
      categories: [],
      series1: [],
      series2: [],
    };
    this.data.forEach(row => {
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
