import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { SeriesDataItem, chartConfig } from '@core/models/charts.model';
import { ProductionPerformance } from '@pi/production-and-inventory.model';

type ProductionCategory = 'CYCLE TIME DEVIATION' | 'PRODUCTION YIELD' | 'SPARE CAPACITY';

@Component({
  selector: 'app-production-performance',
  templateUrl: './production-performance.component.html',
  styleUrl: './production-performance.component.scss',
})
export class ProductionPerformanceComponent implements OnChanges {
  @Input() category: ProductionCategory;
  @Input() data: ProductionPerformance[];
  public chartConfig = chartConfig;
  public series: SeriesDataItem[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.series = this.data.map(row => {
        return {
          xValue: row.process,
          yValue: row.value,
          color: this.barColorByCategory(row.value),
        };
      });
    }
  }

  private barColorByCategory(v: number) {
    if (this.category === 'CYCLE TIME DEVIATION') {
      if (v <= 30) return this.chartConfig.success;
      else if (v <= 40) return this.chartConfig.warning;
      return this.chartConfig.error;
    } else if (this.category === 'PRODUCTION YIELD') {
      if (v <= 60) return this.chartConfig.error;
      else if (v <= 80) return this.chartConfig.warning;
      return this.chartConfig.success;
    } else {
      if (v <= 60) return this.chartConfig.error;
      else if (v <= 80) return this.chartConfig.warning;
      return this.chartConfig.success;
    }
  }
}
