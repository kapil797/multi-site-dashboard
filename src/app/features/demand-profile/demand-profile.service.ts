import { Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';

import { AppService } from '@core/services/app.service';
import { getRandomInt } from '@core/utils/formatters';
import { DemandProfile, DemandSeries, Product } from '@dp/demand-profile.model';
import { DemandProfileModule } from '@dp/demand-profile.module';

@Injectable({
  providedIn: DemandProfileModule,
})
export class DemandProfileService {
  constructor(private app: AppService) {}

  public fetchDemandProfile$(_factory: string, product: Product, forecastMonths: number) {
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

    if (product === 'ESCENTZ') {
      initial = 4125;
      range = 120;
    } else {
      initial = 409;
      range = 37;
    }

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
    this.generateMockData(current, end, pastForecast[pastForecast.length - 1].demand, range, futureForecast);

    const data: DemandProfile = {
      pastForecast,
      actual,
      futureForecast,
    };
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  private generateMockData(currentDate: Date, endDate: Date, initial: number, range: number, results: DemandSeries[]) {
    const changeAmt = getRandomInt(0, range);
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
}
