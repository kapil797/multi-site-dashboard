import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { AppService } from '@core/services/app.service';
import { ProductionTrackingModule } from '@pt/production-tracking.module';
import { Execution, SalesOrder, WorkOrder } from '@pt/production-tracking.model';

@Injectable({
  providedIn: ProductionTrackingModule,
})
export class ProductionTrackingService {
  constructor(
    private http: HttpClient,
    private app: AppService
  ) {}

  public fetchSalesOrders$(factory: string) {
    let api: string;
    if (factory === 'MF') api = this.app.api.getMfSalesOrders;
    else api = this.app.api.getMfSalesOrders;

    return this.http
      .get<SalesOrder[]>(`${api}?limit=6`)
      .pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchWorkOrders$(factory: string) {
    let api: string;
    if (factory === 'MF') api = this.app.api.getMfWorkOrders;
    else api = this.app.api.getMfWorkOrders;

    return this.http
      .get<WorkOrder[]>(`${api}?salesOrderId=testing`)
      .pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchExecutions$(factory: string, workOrderId: string) {
    let api: string;
    if (factory === 'MF') api = this.app.api.postMfExecutions;
    else api = this.app.api.postMfExecutions;

    return this.http
      .post<Execution[]>(api, { ID: workOrderId })
      .pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public getOrderStatus() {}
}
