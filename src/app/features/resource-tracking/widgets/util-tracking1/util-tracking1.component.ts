import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';

@Component({
  selector: 'app-util-tracking1',
  templateUrl: './util-tracking1.component.html',
  styleUrl: './util-tracking1.component.scss',
})
export class UtilTracking1Component {
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

  // According to Kendo,
  // set the style.height to enable vertical scroll
  // when exceed viewList height.
  public viewListHeight = '14rem';

  public data = {
    eScentz: [
      {
        title: 'Injection Moulding:',
        subtitle: 'Past 1 Hr',
        value: '73%',
        color: '#60EA80',
      },
      {
        title: 'Oven 1 & 2:',
        subtitle: 'Past 1 Hr',
        value: '56%',
        color: '#60EA80',
      },
      {
        title: 'Scent Filling:',
        subtitle: 'Past 1 Hr',
        value: '97%',
        color: '#F9B959',
      },
      {
        title: 'Screen Printing:',
        subtitle: 'Past 1 Hr',
        value: '85%',
        color: '#60EA80',
      },
      {
        title: 'Screen Printing:',
        subtitle: 'Past 1 Hr',
        value: '85%',
        color: '#60EA80',
      },
      {
        title: 'Screen Printing:',
        subtitle: 'Past 1 Hr',
        value: '85%',
        color: '#60EA80',
      },
    ],
    mfConnectPlus: [
      {
        title: 'Injection Moulding:',
        subtitle: 'Past 1 Hr',
        value: '12%',
        color: '#60EA80',
      },
      {
        title: 'Oven 1 & 2:',
        subtitle: 'Past 1 Hr',
        value: '43%',
        color: '#60EA80',
      },
      {
        title: 'Screen Printing:',
        subtitle: 'Past 1 Hr',
        value: '10%',
        color: '#60EA80',
      },
    ],
    atomiserMTS: [
      {
        title: 'Injection Moulding:',
        subtitle: 'Past 1 Hr',
        value: '10%',
        color: '#60EA80',
      },
    ],
  };
}
