import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { HashMap } from '@core/models/core.model';
import { capitalizeFirstLetter, stringToCamelCase } from '@core/utils/formatters';

import { MachineResourceHealth } from '@rh/resource-health.model';

interface TransposedData {
  [key: string]: number | string;
  machines: string;
}

@Component({
  selector: 'app-transposed-table',
  templateUrl: './transposed-table.component.html',
  styleUrl: './transposed-table.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TransposedTableComponent implements OnChanges {
  @Input() data: MachineResourceHealth[];
  public gridData: TransposedData[];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.gridData = this.transposeData();
    }
  }
  private transposeData() {
    const results: TransposedData[] = [];
    const newRows = Object.keys(this.data[0]).filter(k => !['category', 'name'].includes(k));
    newRows.forEach(key => {
      const newRow: TransposedData = {
        machines: capitalizeFirstLetter(key),
      };
      this.data.forEach(row => {
        const temp = row as unknown as HashMap;
        const name = stringToCamelCase(row.name);
        newRow[name] = temp[key] as number;
      });
      results.push(newRow);
    });
    return results;
  }

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
