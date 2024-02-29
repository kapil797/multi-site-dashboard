import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { IconDefinition, faBolt, faMinus, faPowerOff, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ColumnSetting } from '@core/models/grid.model';
import { MachineStatus } from '@rt/resource-tracking.model';

interface GridCol extends ColumnSetting {
  icon?: IconDefinition;
}

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CustomTableComponent implements OnInit {
  @Input() data: MachineStatus[];
  @Input() title: string;
  public faPowerOff = faPowerOff;
  public faBolt = faBolt;
  public faTrash = faTrash;
  public faMinus = faMinus;
  public gridCols: GridCol[] = [
    { title: 'Machine Id.', field: 'id', width: 70 },
    { title: 'Name', field: 'name', width: 230 },
    { title: 'Power', field: 'power', icon: faPowerOff },
    { title: 'Energy', field: 'energy', icon: faBolt },
    { title: 'Waste', field: 'waste', icon: faTrash },
  ];

  constructor() {}

  ngOnInit(): void {
    this.data = this.data.map(row => {
      row.id = row.id.toUpperCase();
      row.name = row.name.toUpperCase();
      return row;
    });
  }

  public resolveStatus(status: number) {
    switch (status) {
      case 0:
        return 'icon-neutral';
      case 1:
        return 'icon-success';
      case 2:
        return 'icon-warning';
      case 3:
        return 'icon-error';
      default:
        return 'icon-neutral';
    }
  }

  public resolveIcon(status: number, icon: IconDefinition) {
    if (status == -1) return faMinus;
    return icon;
  }

  public formatWidth(width?: number) {
    return width as number;
  }
}
