import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '@core/services/theme-service.service';
import { Theme } from '@core/constants/theme.constant';
import { catchError, interval, Subscription, switchMap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

interface ApiSalesOrder {
  salesOrderId: string;
  salesOrderNumber: string;
  customerName: string;
  locationName: string;
  completedPercentage: number;
  expectedCompletionDate: string;
  createdAt: string;
}

interface TransformedSalesOrder {
  salesOrderNumber: { value: string };
  factory: { value: string };
  customer: { value: string };
  expectedCompleted: { value: string };
  status: { value: string };
  isLate: { value: boolean };
}

@Component({
  selector: 'app-production-tracking1-large',
  templateUrl: './production-tracking1-large.component.html',
  styleUrls: ['./production-tracking1-large.component.scss'],
})
export class ProductionTracking1LargeComponent implements OnInit, OnDestroy {
  theme: Theme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  machineData: any;
  lookBackPeriod = '1 days';
  productionTrackingData: TransformedSalesOrder[];
  private apiSubscription: Subscription;

  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;
  @Input() api!: string;

  public defaultFontColor = '#E4E9EF';

  constructor(
    private themeService: ThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
    this.startApiPolling();
  }

  ngOnDestroy(): void {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
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

  startApiPolling(): void {
    this.apiSubscription = interval(5000)
      .pipe(switchMap(() => this.fetchApiData()))
      .subscribe(
        response => {
          this.productionTrackingData = this.transformApiResponse(response);
          console.log('Updated production tracking data:', this.productionTrackingData);
        },
        error => console.error('Error fetching API data:', error)
      );
  }

  fetchApiData() {
    const params = new HttpParams().set('lookBackPeriod', this.lookBackPeriod);
    return this.http.get<ApiSalesOrder[]>(this.api, { params }).pipe(
      catchError(error => {
        console.error('API call failed, switching to mock data', error);
        return this.http.get<ApiSalesOrder[]>('assets/mock-data.json');
      })
    );
  }

  public setDefaultHeaderStyle() {
    return {
      'background-color': this.theme?.secondary,
      color: this.defaultFontColor,
      border: '0',
      'border-bottom': '.3rem solid #E4E9EF',
      'font-size': '1.5rem',
    };
  }

  public setDefaultColumnStyle() {
    return {
      color: this.defaultFontColor,
      'font-size': '1.5rem',
      'text-align': 'left',
    };
  }

  public setStatusHeaderStyle() {
    return {
      'background-color': this.theme?.secondary,
      color: this.defaultFontColor,
      border: '0',
      'border-bottom': '.3rem solid #E4E9EF',
      'font-size': '1.5rem',
    };
  }

  public setStatusColumnStyle() {
    return {
      'font-size': '1.5rem',
      'text-align': 'right',
    };
  }

  transformApiResponse(apiResponse: ApiSalesOrder[]): TransformedSalesOrder[] {
    return apiResponse
      .slice(0, 10) // Get the latest 10 records
      .map(order => {
        const expectedCompletionDate = new Date(order.expectedCompletionDate);
        const now = new Date();

        return {
          salesOrderNumber: { value: order.salesOrderNumber },
          factory: { value: order.locationName },
          customer: { value: order.customerName },
          expectedCompleted: {
            value: expectedCompletionDate.toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
          },
          status: { value: `${Math.round(order.completedPercentage * 100)}%` },
          isLate: { value: expectedCompletionDate < now },
        };
      });
  }
}
