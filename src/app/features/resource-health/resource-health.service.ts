import { Injectable } from '@angular/core';
import { catchError, map, of, throwError } from 'rxjs';
import moment from 'moment';

import { getRandomNumber } from '@core/utils/formatters';
import { AppService } from '@core/services/app.service';
import {
  AggregatedResourceConsumption,
  MachineResourceHealth,
  OverallResourceHealth,
  Period,
  ResourceConsumption,
} from '@rh/resource-health.model';

import overall from './mock-data/overall.json';
import machines from './mock-data/machines.json';

@Injectable({
  providedIn: 'any',
})
export class ResourceHealthService {
  constructor(private app: AppService) {}

  public fetchOverallResourceHealth$(_factory: string) {
    const data: OverallResourceHealth[] = overall.map(row => {
      row.categories.forEach(cat => {
        cat.value = this.getRandomNumberOrNull() as number;
      });
      return { ...row };
    });
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchMachinesResourceHealth$(_factory: string) {
    const data: MachineResourceHealth[] = machines.map(row => {
      return {
        ...row,
        OEE: this.getRandomNumberOrNull(),
        availability: this.getRandomNumberOrNull(),
        performance: this.getRandomNumberOrNull(),
        quality: this.getRandomNumberOrNull(),
      };
    });
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchMachineEnergyConsumption$(_factory: string, period: Period, _machine: string) {
    const data: ResourceConsumption[] = this.getArrayOfDatesByPeriod(period).map(v => {
      return {
        createdDate: v,
        generationIntensity: getRandomNumber(0, 0.2),
        amount: getRandomNumber(0, 100),
      };
    });
    return of(data).pipe(
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))),
      map(res => {
        return this.aggregateArrayIntoPeriods(period, res);
      })
    );
  }

  public fetchMachineWasteConsumption$(_factory: string, period: Period, _machine: string) {
    const data: ResourceConsumption[] = this.getArrayOfDatesByPeriod(period).map(v => {
      return {
        createdDate: v,
        generationIntensity: getRandomNumber(0, 0.2),
        amount: getRandomNumber(0, 100),
      };
    });
    return of(data).pipe(
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))),
      map(res => {
        return this.aggregateArrayIntoPeriods(period, res);
      })
    );
  }

  private getRandomNumberOrNull() {
    const v = getRandomNumber(-20, 100);
    if (v <= 0) return null;
    return v;
  }

  private getArrayOfDatesByPeriod(period: Period) {
    const datasetCount = 5;
    const today = new Date();
    const start = new Date();
    const results: string[] = [];
    switch (period) {
      case 'WEEKLY':
        start.setDate(today.getDate() - datasetCount * 7);

        // The set of data will pull an extra day of 1, including today.
        // To exclude the first date.
        start.setDate(start.getDate() + 1);
        break;
      case 'MONTHLY':
        start.setMonth(start.getMonth() - datasetCount);
        break;
      case 'QUARTERLY':
        // 1 quarter has 3 months.
        start.setMonth(start.getMonth() - datasetCount * 3);
        break;
      case 'HALF-YEARLY':
        // Half-year has 6 months.
        start.setMonth(start.getMonth() - datasetCount * 6);
        break;
      case 'YEARLY':
        start.setMonth(start.getMonth() - datasetCount * 12);
        break;
    }

    while (start.getTime() <= today.getTime()) {
      results.push(start.toISOString());
      start.setDate(start.getDate() + 1);
    }
    return results;
  }

  private aggregateArrayIntoPeriods(period: Period, data: ResourceConsumption[]) {
    // Sacrificing optimization for readability.
    // Instead of just iterating through the array, time complexity increases
    // from n to 5n.
    const results: AggregatedResourceConsumption[] = [];
    let count = 0;
    let generationIntensitySum = 0;
    let amountSum = 0;
    let curDate: Date;
    let endDate: Date;
    let periodRange = '';
    let startPeriod = '';

    const reset = () => {
      count = 0;
      generationIntensitySum = 0;
      amountSum = 0;
    };

    data.forEach(row => {
      // Perform aggregation.
      count += 1;
      generationIntensitySum += row.generationIntensity;
      amountSum += row.amount;

      // Get current date without time for safe comparison with endDate.
      curDate = new Date(row.createdDate);
      curDate.setHours(0, 0, 0, 0);

      if (count === 1) {
        endDate = new Date(row.createdDate);
        endDate.setHours(0, 0, 0, 0);

        // For every setDate(), setMonth(), etc., it will add an extra day,
        // since it includes the current day itself.
        // i.e. Add 1 week: Sep 16, 2023 -> Sept 23, 2023
        // Add 1 month: Sep 16, 2023 -> Oct 16, 2023
        // Need to remove the extra day.
        endDate.setDate(endDate.getDate() - 1);

        switch (period) {
          case 'WEEKLY':
            endDate.setDate(endDate.getDate() + 7);
            startPeriod = moment(row.createdDate).format('DD/MM/YYYY');
            break;
          case 'MONTHLY':
            endDate.setMonth(endDate.getMonth() + 1);
            break;
          case 'QUARTERLY':
            endDate.setMonth(endDate.getMonth() + 3);
            startPeriod = moment(row.createdDate).format('MMM YYYY');
            break;
          case 'HALF-YEARLY':
            endDate.setMonth(endDate.getMonth() + 6);
            startPeriod = moment(row.createdDate).format('MMM YYYY');
            break;
          case 'YEARLY':
            endDate.setMonth(endDate.getMonth() + 12);
            break;
        }
      }

      if (curDate.toISOString() === endDate.toISOString()) {
        switch (period) {
          case 'WEEKLY':
            periodRange = `${startPeriod} - ${moment(row.createdDate).format('DD/MM/YYYY')}`;
            break;
          case 'MONTHLY':
            periodRange = moment(row.createdDate).format('MMM YYYY');
            break;
          case 'QUARTERLY':
            periodRange = `${startPeriod} - ${moment(row.createdDate).format('MMM YYYY')}`;
            break;
          case 'HALF-YEARLY':
            periodRange = `${startPeriod} - ${moment(row.createdDate).format('MMM YYYY')}`;
            break;
          case 'YEARLY':
            periodRange = moment(row.createdDate).format('YYYY');
            break;
        }

        results.push({
          generationIntensity: generationIntensitySum / count,
          amount: amountSum / count,
          periodRange: periodRange,
        });
        reset();
      }
    });

    return results;
  }
}
