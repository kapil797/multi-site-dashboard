import { Component, Input } from '@angular/core';
import { progressColors } from '@core/constants/progress-bar.constant';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';

export interface PeriodPerformance {
  pastPeriod: number;
  currentPeriod: number;
  projectedPeriod: number;
}

@Component({
  selector: 'app-production-yield1',
  templateUrl: './production-yield1.component.html',
  styleUrl: './production-yield1.component.scss',
})
export class ProductionYield1Component {
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

  //@Input() data?: PeriodPerformance;

  data: PeriodPerformance = {
    pastPeriod: 51.46497961264991,
    currentPeriod: 83.02090628646826,
    projectedPeriod: 71.92240757886837,
  };

  public progressColors = progressColors;
  public progressStyle = { width: '250px', height: '250px' };

  public formatText(v?: number) {
    if (v === undefined) return '';
    return `${v.toFixed(2)}%`;
  }
}
