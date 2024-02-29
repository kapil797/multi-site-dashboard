import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { progressColors } from '@core/constants/progress-bar.constant';
import { CategoryResourceHealth, OverallResourceHealth } from '@rh/resource-health.model';

@Component({
  selector: 'app-overall-resource-health',
  templateUrl: './overall-resource-health.component.html',
  styleUrl: './overall-resource-health.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class OverallResourceHealthComponent implements OnChanges {
  @Input() data: OverallResourceHealth;
  public progressColors = progressColors;
  public overall: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.overall = this.calcAverage(this.data.categories);
    }
  }

  private calcAverage(data: CategoryResourceHealth[]) {
    let count = 0;
    const sum = data.reduce((prev, cur) => {
      if (cur.value) {
        prev += cur.value;
        count += 1;
      }
      return prev;
    }, 0);
    return sum / count;
  }

  public formatCategoryName(v: string) {
    switch (v.toUpperCase()) {
      case 'SES':
        return 'SES';
      case 'MTS':
        return 'MAKE TO STOCK';
      case 'MTO':
        return 'MAKE TO ORDER';
      default:
        return 'N/A';
    }
  }

  public formatValue(v: number | null) {
    if (!v) return '-';
    return `${Number(v).toFixed(2)}%`;
  }
}
