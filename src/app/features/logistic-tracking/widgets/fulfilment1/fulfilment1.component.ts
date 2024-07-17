import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';

@Component({
  selector: 'app-fulfilment1',
  templateUrl: './fulfilment1.component.html',
  styleUrl: './fulfilment1.component.scss',
})
export class Fulfilment1Component {
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
  public productionCapacity: number = 92;
  public seriesData = [
    { month: 'Jan', value: 90 },
    { month: 'Feb', value: 92 },
    { month: 'Mar', value: 93 },
    { month: 'Apr', value: 91 },
    { month: 'May', value: 92 },
  ];

  public categories: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  public average: number = 92;
  public greenZoneData = [
    { month: 'Jan', min: 91, max: 93 },
    { month: 'Feb', min: 91, max: 93 },
    { month: 'Mar', min: 91, max: 93 },
    { month: 'Apr', min: 91, max: 93 },
    { month: 'May', min: 91, max: 93 },
  ];
}
