import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';

@Component({
  selector: 'app-global-shopfloor-status1',
  templateUrl: './global-shopfloor-status1.component.html',
  styleUrl: './global-shopfloor-status1.component.scss',
})
export class GlobalShopfloorStatus1Component {
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
}
