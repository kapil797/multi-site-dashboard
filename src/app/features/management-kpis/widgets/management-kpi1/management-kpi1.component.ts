import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-management-kpi1',
  templateUrl: './management-kpi1.component.html',
  styleUrl: './management-kpi1.component.scss',
})
export class ManagementKPI1Component {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;

  public item = {
    Id: 12,
    Category: 'Capacity Utilisation',
    Value: '64.58',
    Projection: '95.02',
    ProjectionHealth: 'Green',
    Target: '99.91',
    Period: 'Weekly',
    ProjectionDay: '7 days',
  };

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
