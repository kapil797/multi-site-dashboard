import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Theme } from '@core/constants/theme.constant';
import { ThemeService } from '@core/services/theme-service.service';
import { faPowerOff, faBolt, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { catchError, Observable, interval, Subscription, switchMap } from 'rxjs';

interface ApiRecord {
  machineName: string;
  productName: string;
  utilization: number;
  locationName: string;
  createdAt: string;
}

interface SeriesDataItem {
  month: string;
  value: number;
}

interface GreenZoneDataItem {
  month: string;
  min: number;
  max: number;
}

@Component({
  selector: 'app-machine-status1-small',
  templateUrl: './machine-status1-small.component.html',
  styleUrls: ['./machine-status1-small.component.scss'],
})
export class MachineStatus1SmallComponent implements OnInit, OnDestroy {
  theme: Theme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  lookBackPeriod = '1 days';
  private apiSubscription: Subscription;

  @Input() title: string;
  @Input() subtitle: string;
  @Input() api!: string;

  public powerOffIcon: IconDefinition = faPowerOff;
  public boltIcon: IconDefinition = faBolt;
  public trashIcon: IconDefinition = faTrashCan;
  public productionCapacity: string;
  public seriesData: SeriesDataItem[] = [
    { month: 'Jan', value: 0 },
    { month: 'Feb', value: 0 },
    { month: 'Mar', value: 0 },
    { month: 'Apr', value: 0 },
    { month: 'May', value: 0 },
  ];
  public categories: string[];
  public average: number;
  public greenZoneData: GreenZoneDataItem[];
  public textColor: string;

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
        response => this.handleApiResponse(response),
        error => console.error('Error fetching API data:', error)
      );
  }

  fetchApiData(): Observable<ApiRecord[]> {
    const params = new HttpParams().set('lookBackPeriod', this.lookBackPeriod);
    return this.http.get<ApiRecord[]>(this.api, { params }).pipe(
      catchError(error => {
        console.error('API call failed, switching to mock data', error);
        return this.http.get<ApiRecord[]>('assets/mock-data.json');
      })
    );
  }

  handleApiResponse(response: ApiRecord[]): void {
    console.log('Processed response data: from machine status', response);

    const latestFiveRecords = response
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const utilizationValues = latestFiveRecords.map(record => record.utilization);

    this.seriesData = this.seriesData.map((item, index) => ({
      ...item,
      value: utilizationValues[index] || item.value,
    }));

    this.productionCapacity = '92 %';
    this.textColor = '#7fea8a';
    this.categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    this.average = 92;
    this.greenZoneData = [
      { month: 'Jan', min: 0.01, max: 0.03 },
      { month: 'Feb', min: 0.01, max: 0.03 },
      { month: 'Mar', min: 0.01, max: 0.03 },
      { month: 'Apr', min: 0.01, max: 0.03 },
      { month: 'May', min: 0.01, max: 0.03 },
    ];

    console.log('Updated seriesData:', this.seriesData);
  }
}
