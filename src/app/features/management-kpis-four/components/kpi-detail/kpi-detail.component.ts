import { Component, Input } from '@angular/core';
import { ManagementLayerOneData } from '@mk4/management-kpis-four-model';

@Component({
  selector: 'app-kpi-detail',
  templateUrl: './kpi-detail.component.html',
  styleUrl: './kpi-detail.component.scss',
})
export class KpiDetailComponent {
  @Input() item: ManagementLayerOneData;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isVolumeRelated(item: any) {
    return ['Profit', 'Inventory', 'Production Volume', 'Cost'].includes(item.Category);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUnits(item: any): string {
    switch (item.Category) {
      case 'Profit':
      case 'Inventory':
      case 'Cost':
        return 'SGD';
      case 'On-Time Delivery':
      case 'Capacity Utilisation':
        return '%';
      case 'Safety':
        return 'INCIDENT/MIL HRS';
      case 'Total Productivity':
        return '$/$';
      case 'Production Volume':
        return 'UNITS';
      default:
        return '';
    }
  }
}
