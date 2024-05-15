import { Component } from '@angular/core';

@Component({
  selector: 'app-management-kpi3',
  standalone: true,
  imports: [],
  templateUrl: './management-kpi3.component.html',
  styleUrl: './management-kpi3.component.scss'
})
export class ManagementKPI3Component {

  public item = {"Id":8,"Category":"Profit","Value":14636.0,"Projection":68.24,"ProjectionHealth":"Yellow","Target":74.25,"Period":"Weekly","ProjectionDay":"7 days"};

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
