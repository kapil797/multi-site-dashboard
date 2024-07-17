import { ChangeDetectorRef, Component } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';

import { FeatureService } from '@core/services/feature.service';
import { ThemeService } from '@core/services/theme-service.service';

@Component({
  selector: 'app-multi-site',
  templateUrl: './multi-site.component.html',
  styleUrl: './multi-site.component.scss',
})
export class MultiSiteComponent {
  theme?: Theme;
  public title: string = 'Critical Issues';
  activeButton: string = 'value-chain';

  setActive(button: string): void {
    this.activeButton = button;
  }
  handleKeyDown(event: KeyboardEvent, button: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.setActive(button);
      event.preventDefault(); // Prevent default behavior of spacebar key
    }
  }
  setThemeVariables(): void {
    if (this.theme) {
      document.documentElement.style.setProperty('--ribbon', this.theme.ribbon);
      document.documentElement.style.setProperty('--primary', this.theme.primary);
      document.documentElement.style.setProperty('--secondary', this.theme.secondary);
      document.documentElement.style.setProperty('--tertiary', this.theme.tertiary);
    }
  }
  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
  }
  constructor(
    private themeService: ThemeService,
    private featureService: FeatureService,
    private cdr: ChangeDetectorRef
  ) {}
}
