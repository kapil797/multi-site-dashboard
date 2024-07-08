import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';
import { LabelFn, LabelSettings } from '@progress/kendo-angular-progressbar';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-production-capacity1-small',
  templateUrl: './production-capacity1-small.component.html',
  styleUrl: './production-capacity1-small.component.scss',
})
export class ProductionCapacity1SmallComponent {
  theme?: Theme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;

  constructor(
    private themeService: ThemeService,
    private http: HttpClient
  ) {}

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
  // Method to test the API
  testApi(apiUrl: string): void {
    const mockDataUrl = 'assets/mock-data.json'; // Replace with your actual mock data URL

    this.http
      .get(apiUrl)
      .pipe(
        catchError(error => {
          console.error('API call failed, switching to mock data', error);
          return this.http.get(mockDataUrl); // Try to load mock data
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('API response:', response);
          this.handleApiResponse(response);
        } else {
          console.warn('No response from API or mock data');
        }
      });
  }

  // Method to handle the API or mock data response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleApiResponse(response: any): void {
    // Process the response data
    console.log('Processed response data:', response);
    // Example: Update the component's state or UI with the response data
    this.item = response;
  }
}
