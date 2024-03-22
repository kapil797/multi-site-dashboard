import { Component, Input, OnInit } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { LegendLabelsContentArgs } from '@progress/kendo-angular-charts';

import { chartConfig } from '@core/models/charts.model';

export interface DataItem {
  category: string;
  value: number;
}
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent implements OnInit {
  @Input() data: DataItem[];
  @Input() chartTitle: string;
  @Input() displayNoValueMessage: boolean;
  public labelColor: string = 'rgb(255,255,255)';
  public chartConfig = chartConfig;

  constructor(private intl: IntlService) {
    this.labelContent = this.labelContent.bind(this);
  }

  ngOnInit() {
    console.log('te', this.data, this.chartTitle, this.displayNoValueMessage);
  }

  public labelContent(args: LegendLabelsContentArgs): string {
    return `${args.dataItem.category.toUpperCase()} (SGD)\nTOTAL: ${this.intl.formatNumber(args.dataItem.value, 'p2')}`;
  }
}
