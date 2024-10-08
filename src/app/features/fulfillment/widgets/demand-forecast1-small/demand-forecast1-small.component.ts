/* eslint-disable prefer-const */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DemandProfileService } from '@dp/demand-profile.service';

import {
  chartConfig,
  constructAreaLegend,
  constructDottedLineLegend,
  constructLineLegend,
} from '@core/models/charts.model';
import { DemandProfile, DemandSeries, Product } from '@dp/demand-profile.model';
import { LegendItemVisualArgs } from '@progress/kendo-angular-charts';
import { Element } from '@progress/kendo-drawing';
import { getRandomInt } from '@core/utils/formatters';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '@core/services/theme-service.service';
import { Theme } from '@core/constants/theme.constant';
import { catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Zone {
  value: number;
  direction: string;
}

@Component({
  selector: 'app-demand-forecast1-small',
  templateUrl: './demand-forecast1-small.component.html',
  styleUrl: './demand-forecast1-small.component.scss',
})
export class DemandForecast1SmallComponent implements OnChanges {
  theme: Theme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;

  constructor(
    private themeService: ThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.setThemeVariables();
    this.data = this.getMockDemandForcast('MFCONNECT+', 3);

    //this.testApi(this.api);

    this.seriesColor = '#8829C3';
    this.alertContent = 'Spike detected: > 2000 pcs';
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

  public data: DemandProfile;
  //public alert: string;
  alertContent: string;
  alertIcon = faTriangleExclamation;

  public chartConfig = chartConfig;
  public seriesColor: string;
  public majorGridLines = { visible: true, color: chartConfig.color, width: 0.1 };

  public dp: DemandProfileService;

  public getMockDemandForcast(product: Product, forecastMonths: number): DemandProfile {
    // Fetch 1 month prior to today, and forecastMonths of projected forecast.
    const start = new Date();
    const today = new Date();
    const end = new Date();
    start.setMonth(today.getMonth() - 1);
    start;
    end.setMonth(today.getMonth() + forecastMonths);

    let current = new Date(start);
    let initial: number;
    let range: number;
    let zones: Zone[];

    initial = 2000;
    range = 50;
    zones = [
      {
        value: 0.1,
        direction: 'DOWN',
      },
      {
        value: 0.1,
        direction: 'UP',
      },
      {
        value: 0.3,
        direction: 'DOWN',
      },
      {
        value: 0.3,
        direction: 'UP',
      },
      { value: 0.2, direction: 'DOWN' },
    ];

    // Get previous forecast.
    const pastForecast: DemandSeries[] = [];
    this.generateMockData(current, today, initial, range, pastForecast);

    // Get actual.
    current = new Date(start);
    const actual: DemandSeries[] = [];
    this.generateMockData(current, today, initial, range, actual);

    // Get future forecast.
    current = new Date(today);
    const futureForecast: DemandSeries[] = [];
    this.generateSpikesAndPlummetsData(
      current,
      end,
      pastForecast[pastForecast.length - 1].demand,
      range,
      zones,
      futureForecast
    );
    console.log('pf', pastForecast);
    console.log('ac', actual);
    console.log('ff', futureForecast);

    const data: DemandProfile = {
      pastForecast,
      actual,
      futureForecast,
    };

    return data;
  }

  private generateMockData(currentDate: Date, endDate: Date, initial: number, range: number, results: DemandSeries[]) {
    const changeAmt = getRandomInt(range / 2, range);
    while (currentDate.getTime() < endDate.getTime()) {
      if (results.length === 0) {
        results.push({ createdDate: new Date(currentDate), demand: initial });
      } else {
        const prev = results[results.length - 1].demand;
        const temp = getRandomInt(0, 10);
        results.push({ createdDate: new Date(currentDate), demand: temp < 7 ? prev + changeAmt : prev - changeAmt });
      }
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
  }

  private generateSpikesAndPlummetsData(
    currentDate: Date,
    endDate: Date,
    initial: number,
    range: number,
    zones: Zone[],
    results: DemandSeries[]
  ) {
    const numberOfDays = Math.ceil((endDate.getTime() - currentDate.getTime()) / (60 * 60 * 24 * 1000));
    let curDemand = initial;
    for (const zone of zones) {
      const count = Math.floor(numberOfDays * zone.value);
      for (let i = 0; i < count; i++) {
        const amt = zone.direction === 'UP' ? getRandomInt(range, range * 2) : -getRandomInt(0, range);
        curDemand += amt;
        results.push({ createdDate: new Date(currentDate), demand: curDemand });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title']) {
      if (this.title.includes('ESCENTZ')) {
        this.seriesColor = 'rgb(255, 240, 31)';
      } else {
        this.seriesColor = 'rgb(138, 38, 255)';
      }
    }
  }

  public labelsVisual(args: LegendItemVisualArgs): Element {
    if (args.series.name === 'Past Forecast') {
      return constructLineLegend(args);
    } else if (args.series.name === 'Future Forecast') {
      return constructDottedLineLegend(args);
    } else if (args.series.name === 'Actual') {
      return constructAreaLegend(args);
    }
    // return the default visualization of the legend items
    args.options.labels.color = chartConfig.color;
    return args.createVisual();
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
    this.item = response;
    this.convertDatesInItem();
    console.log('item after response:', this.item);
  }

  // Helper method to convert ISO date strings to JavaScript Date objects
  private convertISOToDate(isoDateString: string): Date {
    return new Date(isoDateString);
  }

  // Method to convert dates in the item
  private convertDatesInItem(): void {
    ['pastForecast', 'actual', 'futureForecast'].forEach(key => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.item[key] = this.item[key].map((entry: any) => ({
        ...entry,
        createdDate: this.convertISOToDate(entry.createdDate),
        _date_createdDate: this.convertISOToDate(entry._date_createdDate),
      }));
    });
  }
}
