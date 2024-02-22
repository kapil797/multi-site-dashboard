import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { HashMap } from '@core/models/abstract.model';
import { ColumnSetting } from '@core/models/grid.model';
import { capitalizeFirstLetter, stringToCamelCase } from '@core/utils/formatters';

import { MachineResourceHealth } from '@rh/resource-health.model';

interface TransposedData {
  [key: string]: number | string;
  machines: string;
}

interface GroupedColumnSettings {
  title: string;
  columns: ColumnSetting[];
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
  public gridColGroups: GroupedColumnSettings[] = [
    {
      title: 'Smart Engineering System (SES)',
      columns: [
        { title: 'Milling', field: 'milling' },
        { title: 'EDM', field: 'edm' },
        { title: 'CMM', field: 'cmm' },
        { title: 'Robotic Arm', field: 'roboticArm' },
      ],
    },
    {
      title: 'Make to Stock (MTS)',
      columns: [
        { title: 'Injection Modeling', field: 'injectionModeling' },
        { title: 'InfraRed Oven 1', field: 'infraredOven1' },
        { title: 'InfraRed Oven 2', field: 'infraredOven2' },
        { title: 'Screen Printer 1', field: 'screenPrinter1' },
        { title: 'Screen Printer 2', field: 'screenPrinter2' },
        { title: 'Membrane Assembly', field: 'membraneAssembly' },
        { title: 'Laser Welding', field: 'laserWelding' },
        { title: 'Laser Trimming', field: 'laserTrimming' },
        { title: 'Cartridge Tester', field: 'cartridgeTester' },
      ],
    },
    {
      title: 'Make to Order (MTO)',
      columns: [
        { title: 'Scent Filling', field: 'scentFilling' },
        { title: 'Holder Assembly', field: 'holderAssembly' },
        { title: 'Holder Tester', field: 'holderTester' },
        { title: 'Inkjet Printer', field: 'inkjetPrinter' },
      ],
    },
  ];

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
