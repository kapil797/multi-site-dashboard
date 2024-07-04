import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';
import { LabelFn, LabelSettings } from '@progress/kendo-angular-progressbar';

@Component({
  selector: 'app-production-capacity1',
  templateUrl: './production-capacity1.component.html',
  styleUrl: './production-capacity1.component.scss',
})
export class ProductionCapacity1Component {
  theme?: Theme;

  constructor(private themeService: ThemeService) {}

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
    MFConnect: {
      value: 5284,
      maxValue: 12651,
    },
    EScentz: {
      value: 4109,
      maxValue: 13128,
    },
    Atomiser: {
      value: 1875,
      maxValue: 8293,
    },
  };

  public labelMFConnect: LabelSettings = {};
  public labelEScentz: LabelSettings = {};
  public labelAtomiser: LabelSettings = {};

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
    this.labelMFConnect = {
      format: this.formatterMFConnect,
      position: 'end',
    };
    this.labelEScentz = {
      format: this.formatterEScentz,
      position: 'end',
    };
    this.labelAtomiser = {
      format: this.formatterAtomiser,
      position: 'end',
    };
  }

  public formatterMFConnect: LabelFn = (value: number): string => {
    return `${value.toLocaleString()} / ${this.data.MFConnect.maxValue.toLocaleString()}`;
  };
  public formatterEScentz: LabelFn = (value: number): string => {
    return `${value.toLocaleString()} / ${this.data.EScentz.maxValue.toLocaleString()}`;
  };
  public formatterAtomiser: LabelFn = (value: number): string => {
    return `${value.toLocaleString()} / ${this.data.Atomiser.maxValue.toLocaleString()}`;
  };

  public setProgressPartRowOneStyle() {
    let style = { 'background-color': '#3A36DB' };
    return style;
  }

  public setEmptyPartRowOneStyle() {
    let style = { 'background-color': '#0B2860', color: '#FFFFFF', 'font-size': '1rem' };
    return style;
  }

  public setProgressPartRowTwoStyle() {
    let style = { 'background-color': '#DB5AEE' };
    return style;
  }

  public setEmptyPartRowTwoStyle() {
    let style = { 'background-color': '#2C3063', color: '#FFFFFF', 'font-size': '1rem' };
    return style;
  }

  public setProgressPartRowThreeStyle() {
    let style = { 'background-color': '#59DAF9' };
    return style;
  }

  public setEmptyPartRowThreeStyle() {
    let style = { 'background-color': '#114A65', color: '#FFFFFF', 'font-size': '1rem' };
    return style;
  }
}
