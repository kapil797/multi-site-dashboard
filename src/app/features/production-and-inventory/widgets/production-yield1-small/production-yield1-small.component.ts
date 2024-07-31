import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { progressColors } from '@core/constants/progress-bar.constant';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';
import { catchError } from 'rxjs';

export interface PeriodPerformance {
  pastPeriod: number;
  currentPeriod: number;
  projectedPeriod: number;
}

@Component({
  selector: 'app-production-yield1-small',
  templateUrl: './production-yield1-small.component.html',
  styleUrl: './production-yield1-small.component.scss',
})
export class ProductionYield1SmallComponent {
  theme?: Theme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;

  constructor(
    private themeService: ThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
    this.testApi(this.api);
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

  data: PeriodPerformance;

  public progressColors = progressColors;
  public progressStyle = { width: '250px', height: '250px' };

  public formatText(v?: number) {
    if (v === undefined) return '';
    return `${v.toFixed(2)}%`;
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
    this.data = response;
  }
}
