import { Component, Input, ViewEncapsulation } from '@angular/core';

import { MachineResourceHealth } from '@rh/resource-health.model';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CustomTableComponent {
  @Input() gridData: MachineResourceHealth[];

  constructor() {}

  public formatValue(v: number | null) {
    if (!v) return '-';
    return `${Number(v).toFixed(2)}%`;
  }

  public formatClassColor(v: number | null) {
    if (!v) return '';
    if (v < 60) return 'error';
    else if (v < 80) return 'warning';
    return 'success';
  }
}
