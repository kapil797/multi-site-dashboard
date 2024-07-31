import { Component, Input } from '@angular/core';

import { OnInit } from '@angular/core';
import { ThemeService } from '@core/services/theme-service.service';
import { Theme } from '@core/constants/theme.constant';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface SupplierInventoryData {
  company: object;
  turnover: object;
  fillRate: object;
  stockout: object;
}

@Component({
  selector: 'app-supplier-inventory1-medium',
  templateUrl: './supplier-inventory1-medium.component.html',
  styleUrl: './supplier-inventory1-medium.component.scss',
})
export class SupplierInventory1MediumComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;
  @Input() api!: string;
  theme: Theme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;

  constructor(
    private themeService: ThemeService,
    private http: HttpClient
  ) {}

  public defaultFontColor = '#E4E9EF';

  public isLoading = true;

  public supplierInventoryData: SupplierInventoryData[];
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
    this.supplierInventoryData = [];
    console.log('hello', this.api);
    this.testApi(this.api);
  }

  public setDefaultHeaderStyle() {
    const style = {
      'background-color': this.theme.secondary,
      color: this.defaultFontColor,
      border: '0',
      'border-bottom': '.3rem solid #E4E9EF',
      'font-size': '1.5rem',
    };

    return style;
  }

  public setDefaultColumnStyle() {
    const style = {
      color: this.defaultFontColor,
      'font-size': '1.5rem',
      'text-align': 'left',
    };

    return style;
  }

  public setStatusHeaderStyle() {
    const style = {
      'background-color': this.theme.secondary,
      color: '#E4E9EF',
      border: '0',
      'border-bottom': '.3rem solid #E4E9EF',
      'font-size': '1.5rem',
      'justify-content': 'right',
    };
    return style;
  }

  public setStatusColumnStyle() {
    const style = {
      'font-size': '1.5rem',
      'text-align': 'right',
    };

    return style;
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
