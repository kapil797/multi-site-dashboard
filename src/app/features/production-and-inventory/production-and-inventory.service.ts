import { Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';

import { AppService } from '@core/services/app.service';
import { ProductionAndInventoryModule } from '@pi/production-and-inventory.module';
import { InventoryPerformance, ProductionPerformance } from './production-and-inventory.model';
import { getRandomInt, getRandomNumber } from '@core/utils/formatters';

import productionPerformance from './mock-data/production-performance.json';

@Injectable({
  providedIn: ProductionAndInventoryModule,
})
export class ProductionAndInventoryService {
  constructor(private app: AppService) {}

  public fetchInventoryPerformance$(_factory: string) {
    const data: InventoryPerformance = {
      fillRate: getRandomNumber(0, 100),
      turns: getRandomNumber(0.1, 1),
      value: getRandomInt(5000, 25000),
    };
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchProductionPerformance$(_factory: string) {
    const data: ProductionPerformance[] = productionPerformance.map(row => {
      return {
        value: getRandomNumber(0, 100),
        process: row.process,
      };
    });
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }
}
