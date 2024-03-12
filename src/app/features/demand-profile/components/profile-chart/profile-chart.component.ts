import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  chartConfig,
  constructAreaLegend,
  constructDottedLineLegend,
  constructLineLegend,
} from '@core/models/charts.model';
import { DemandProfile } from '@dp/demand-profile.model';
import { LegendItemVisualArgs } from '@progress/kendo-angular-charts';
import { Element } from '@progress/kendo-drawing';

@Component({
  selector: 'app-profile-chart',
  templateUrl: './profile-chart.component.html',
  styleUrl: './profile-chart.component.scss',
})
export class ProfileChartComponent implements OnChanges {
  @Input() data: DemandProfile;
  @Input() title: string;
  public chartConfig = chartConfig;
  public seriesColor: string;
  public majorGridLines = { visible: true, color: chartConfig.color, width: 0.1 };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title']) {
      if (this.title.includes('ESCENTZ')) {
        this.seriesColor = 'rgb(255, 240, 31)';
      } else {
        this.seriesColor = 'rgb(138, 38, 255)';
      }
    }
  }

  public labelsVisual(args: LegendItemVisualArgs): Element {
    if (args.series.name === 'Past Forecast') {
      return constructLineLegend(args);
    } else if (args.series.name === 'Future Forecast') {
      return constructDottedLineLegend(args);
    } else if (args.series.name === 'Actual') {
      return constructAreaLegend(args);
    }
    // return the default visualization of the legend items
    args.options.labels.color = chartConfig.color;
    return args.createVisual();
  }
}
