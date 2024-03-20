import { Component, Input } from '@angular/core';
import { chartConstant } from '@core/constants/chart.constant';
import { LegendLabelsContentArgs } from '@progress/kendo-angular-charts';
import { IntlService } from '@progress/kendo-angular-intl';

export interface DataItem {
  category: string;
  value: number;
}
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent {
  @Input() data: DataItem[];
  @Input() chartTitle: string;
  @Input() displayNoValueMessage: boolean;
  labelColor: string = 'rgb(255,255,255)';
  chartConstant = chartConstant;
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
