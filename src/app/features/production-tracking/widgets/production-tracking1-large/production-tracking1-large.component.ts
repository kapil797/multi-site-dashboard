import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import productionTrackingJson from '../../../../../assets/mock-data/production-tracking/production-tracking-1.json';
import { ThemeService } from '@core/services/theme-service.service';
import { Theme } from '@core/constants/theme.constant';
import { catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface productionTrackingData {
  salesOrderNumber: {};
  factory: {};
  customer: {};
  expectedCompleted: {};
  status: {};
}

@Component({
  selector: 'app-production-tracking1-large',
  templateUrl: './production-tracking1-large.component.html',
  styleUrl: './production-tracking1-large.component.scss',
})
export class ProductionTracking1LargeComponent implements OnInit {
  theme: Theme;
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

  public defaultFontColor = '#E4E9EF';

  public productionTrackingData: productionTrackingData[];

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
    this.productionTrackingData;

    this.loadProductionTrackingDataFromMock();
  }

  private loadProductionTrackingDataFromMock() {
    this.productionTrackingData = productionTrackingJson;
  }

  public setDefaultHeaderStyle() {
    const style = {
      'background-color': this.theme?.secondary,
      color: this.defaultFontColor,
      border: '0',
      'border-bottom': '.3rem solid #E4E9EF',
      'font-size': '1.5rem',
    };

    return style;
  }

  public setDefaultColumnStyle() {
    let style = {
      color: this.defaultFontColor,
      'font-size': '1.5rem',
      'text-align': 'left',
    };

    return style;
  }

  public setStatusHeaderStyle() {
    const style = {
      'background-color': this.theme?.secondary,
      color: this.defaultFontColor,
      border: '0',
      'border-bottom': '.3rem solid #E4E9EF',
      'font-size': '1.5rem',
      // 'justify-content': 'right'
    };
    return style;
  }

  public setStatusColumnStyle() {
    let style = {
      'font-size': '1.5rem',
      'text-align': 'right',
    };

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
