import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';

@Component({
  selector: 'app-resource-efficiencies1',
  templateUrl: './resource-efficiencies1.component.html',
  styleUrl: './resource-efficiencies1.component.scss',
})
export class ResourceEfficiencies1Component {
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

  public data = {
    energyEfficiencies: {
      value: '22.55%',
      color: '#E95459',
    },
    resourceEfficiencies: {
      value: '81%',
      color: '#60EA80',
    },
  };
}
