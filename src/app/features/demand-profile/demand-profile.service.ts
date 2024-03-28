import { Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';

import { AppService } from '@core/services/app.service';
import { getRandomInt } from '@core/utils/formatters';
import { DemandProfile, DemandSeries, Product } from '@dp/demand-profile.model';

interface Zone {
  value: number;
  direction: string;
}

@Injectable({
  providedIn: 'any',
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
    let zones: Zone[];

    if (product === 'ESCENTZ') {
      initial = 4125;
      range = 200;
      zones = [
        {
          value: 0.3,
          direction: 'UP',
        },
        {
          value: 0.2,
          direction: 'DOWN',
        },
        {
          value: 0.3,
          direction: 'UP',
        },
        { value: 0.2, direction: 'DOWN' },
      ];
    } else {
      initial = 409;
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
    this.generateSpikesAndPlummetsData(
      current,
      end,
      pastForecast[pastForecast.length - 1].demand,
      range,
      zones,
      futureForecast
    );

    const data: DemandProfile = {
      pastForecast,
      actual,
      futureForecast,
    };
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
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
}
