import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';
import { DashType } from '@progress/kendo-angular-charts';

@Component({
  selector: 'app-monthly-oee1',
  templateUrl: './monthly-oee1.component.html',
  styleUrl: './monthly-oee1.component.scss',
})
export class MonthlyOEE1Component {
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

  public valueAxisColor = '#ffffff';
  public categoryAxisColor = '#ffffff';
  public valueAxisFont = '1.5rem proxima Nova';
  public categoryAxisFont = '1.5rem proxima Nova';

  public availabilityBarColor = '#2F3C6A';
  public performanceBarColor = '#673C6C';
  public qualityBarColor = '#8C4752';
  public averageOEEColor = '#ffffff';
  public normalisedOEEColor = '#ffffff';

  public dashTypeAverageOEE: DashType = 'solid';
  public dashTypeNormalisedOEE: DashType = 'dash';

  public chartHeight = 600;
  public chartWidth = 600;

  public data = {
    categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    availability: [69, 74, 81, 72, 73, 85],
    performance: [70, 70, 78, 70, 81, 82],
    quality: [71, 75, 80, 81, 82, 83],
    averageOEE: [70, 71, 79, 75, 78, 82],
    normalisedOEE: [65, 80, 75, 74, 76, 79],
  };
}
