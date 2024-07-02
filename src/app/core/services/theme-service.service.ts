import { Injectable } from '@angular/core';
import layoutData from 'layoutConfig.json';
import { Theme, ThemeConstant, ThemeKeys } from '@core/constants/theme.constant';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme: Theme | undefined;

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const themeKey: ThemeKeys = layoutData.Styles.colorTheme as ThemeKeys;
    this.theme = ThemeConstant.THEMES[themeKey];
  }

  public getTheme(): Theme | undefined {
    return this.theme;
  }
}
