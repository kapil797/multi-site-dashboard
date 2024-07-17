import { Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';

import { AppService } from '@core/services/app.service';
import { InventoryPerformance, ProductionPerformance } from './production-and-inventory.model';
import { getRandomInt, getRandomNumber } from '@core/utils/formatters';

import productionPerformance from './mock-data/production-performance.json';

@Injectable({
  providedIn: 'any',
})
export class ProductionAndInventoryService {
  constructor(private app: AppService) {}

  public fetchInventoryPerformance$(_factory: string) {
    const data: InventoryPerformance = {
      fillRate: getRandomNumber(75, 100),
      turns: getRandomNumber(3, 12),
      value: getRandomInt(10000, 20000),
    };
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchProductionPerformance$(_factory: string) {
    const data: ProductionPerformance[] = productionPerformance.map(row => {
      return {
        value: getRandomNumber(30, 100),
        process: row.process,
      };
    });
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }
}
