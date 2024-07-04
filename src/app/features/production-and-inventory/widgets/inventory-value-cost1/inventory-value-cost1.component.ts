import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';

@Component({
  selector: 'app-inventory-value-cost1',
  templateUrl: './inventory-value-cost1.component.html',
  styleUrl: './inventory-value-cost1.component.scss',
})
export class InventoryValueCost1Component {
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

  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;
  @Input() api!: string;

  data = {
    valueKPI: {
      value: '86,209',
      color: '#60EA80',
      good: '>80k',
      acceptable: '50-80k',
      poor: '<50k',
    },
    costKPI: {
      value: '46,209',
      color: '#F9B959',
      good: '0-50k',
      acceptable: '50-100k',
      poor: '>100k',
    },
  };
}
