import { Component, Input, OnInit } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';

@Component({
  selector: 'app-management-kpi1',
  templateUrl: './management-kpi1.component.html',
  styleUrls: ['./management-kpi1.component.scss'], // Fix typo: styleUrl -> styleUrls
})
export class ManagementKPI1Component implements OnInit {
  theme?: Theme;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
  }

  setThemeVariables(): void {
    if (this.theme) {
      document.documentElement.style.setProperty('--ribbon', this.theme.ribbon);
      document.documentElement.style.setProperty('--primary', this.theme.primary);
      document.documentElement.style.setProperty('--secondary', this.theme.secondary);
      document.documentElement.style.setProperty('--tertiary', this.theme.tertiary);
    }
  }

  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() tag!: string;

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

  isVolumeRelated(item: { Category: string }): boolean {
    return ['Profit', 'Inventory', 'Production Volume', 'Cost'].includes(item.Category);
  }

  getUnits(item: { Category: string }): string {
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
