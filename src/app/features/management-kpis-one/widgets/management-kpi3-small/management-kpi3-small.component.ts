import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-management-kpi3-small',
  templateUrl: './management-kpi3-small.component.html',
  styleUrl: './management-kpi3-small.component.scss',
})
export class ManagementKPI3SmallComponent {
  theme?: Theme;

  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() tag!: string;
  @Input() api!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;

  constructor(
    private themeService: ThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
    console.log('management-Kpis-one', this.api);
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

  testApi(apiUrl: string): void {
    const mockDataUrl = 'assets/mock-data.json'; // Replace with your actual mock data URL

    this.http
      .get(apiUrl)
      .pipe(
        catchError(error => {
          console.error('API call failed, switching to mock data', error);
          return this.http.get(mockDataUrl).pipe(
            catchError(mockError => {
              console.error('Mock data load failed', mockError);
              return of(null); // Return null observable if both API and mock data fail
            })
          );
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleApiResponse(response: any): void {
    console.log('Processed response data:', response);
    this.item = response;
  }
}
