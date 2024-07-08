import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';

@Component({
  selector: 'app-management-kpi3-small',
  templateUrl: './management-kpi3-small.component.html',
  styleUrl: './management-kpi3-small.component.scss',
})
export class ManagementKPI3SmallComponent {
  theme?: Theme;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;
  @Input() api!: string;
  constructor(private themeService: ThemeService) {}
  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
    console.log('managment-Kpis-three', this.api);
  }
  setThemeVariables(): void {
    if (this.theme) {
      document.documentElement.style.setProperty('--ribbon', this.theme.ribbon);
      document.documentElement.style.setProperty('--primary', this.theme.primary);
      document.documentElement.style.setProperty('--secondary', this.theme.secondary);
      document.documentElement.style.setProperty('--tertiary', this.theme.tertiary);
    }
  }

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
