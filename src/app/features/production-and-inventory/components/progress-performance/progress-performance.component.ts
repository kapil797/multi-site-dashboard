import { Component, Input } from '@angular/core';
import { progressColors } from '@core/constants/progress-bar.constant';

export interface PeriodPerformance {
  pastPeriod: number;
  currentPeriod: number;
  projectedPeriod: number;
}

@Component({
  selector: 'app-progress-performance',
  templateUrl: './progress-performance.component.html',
  styleUrl: './progress-performance.component.scss',
})
export class ProgressPerformanceComponent {
  @Input() data?: PeriodPerformance;
  public progressColors = progressColors;
  public progressStyle = { width: '250px', height: '250px' };

  public formatText(prefix: string, v?: number) {
    if (v === undefined) return '';
    return `${prefix} \n \n ${v.toFixed(2)}%`;
  }
}
