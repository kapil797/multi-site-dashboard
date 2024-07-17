import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';
import { DashType } from '@progress/kendo-angular-charts';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-monthly-oee1-medium',
  templateUrl: './monthly-oee1-medium.component.html',
  styleUrl: './monthly-oee1-medium.component.scss',
})
export class MonthlyOEE1MediumComponent {
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

  public valueAxisColor = '#ffffff';
  public categoryAxisColor = '#ffffff';
  public valueAxisFont = '1.5rem proxima Nova';
  public categoryAxisFont = '1.5rem proxima Nova';

  public availabilityBarColor = '#2F3C6A';
  public performanceBarColor = '#673C6C';
  public qualityBarColor = '#8C4752';
  public averageOEEColor = '#ffffff';
  public normalisedOEEColor = '#ffffff';

  public dashTypeAverageOEE: DashType = 'solid';
  public dashTypeNormalisedOEE: DashType = 'dash';

  public chartHeight = 600;
  public chartWidth = 600;

  public data = {
    categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    availability: [69, 74, 81, 72, 73, 85],
    performance: [70, 70, 78, 70, 81, 82],
    quality: [71, 75, 80, 81, 82, 83],
    averageOEE: [70, 71, 79, 75, 78, 82],
    normalisedOEE: [65, 80, 75, 74, 76, 79],
  };
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
