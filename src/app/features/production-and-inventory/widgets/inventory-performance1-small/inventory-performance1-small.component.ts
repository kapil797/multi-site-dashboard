import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';

@Component({
  selector: 'app-inventory-performance1-small',
  templateUrl: './inventory-performance1-small.component.html',
  styleUrl: './inventory-performance1-small.component.scss',
})
export class InventoryPerformance1SmallComponent {
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
    filterRate: {
      value: '90.54%',
      color: '#60EA80',
      good: '>90%',
      acceptable: '85-90%',
      poor: '<85%',
    },
    turnover: {
      value: '4',
      color: '#F9B959',
      good: '5-10',
      acceptable: '1-5 or 10-15',
      poor: '<1 or >15',
    },
    stockout: {
      value: '2%',
      color: '#60EA80',
      good: '<5%',
      acceptable: '>5% and <10%',
      poor: '>10%',
    },
  };
}
