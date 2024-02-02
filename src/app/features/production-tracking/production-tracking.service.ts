import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, of, throwError } from 'rxjs';

import { AppService } from '@core/services/app.service';
import { ProductionTrackingModule } from '@pt/production-tracking.module';
import { Execution, ProcessTracking, SalesOrder, WorkOrder } from '@pt/production-tracking.model';
import { Factory } from '@core/models/factory.model';

import salesOrder from './mock-data/sales-order.json';
import workOrder1 from './mock-data/work-order.json';
import workOrder2 from './mock-data/work-order2.json';
import execution1 from './mock-data/execution.json';
import execution2 from './mock-data/execution2.json';
import processTracking from './mock-data/process-tracking.json';

/*
  SalesOrder has one-to-many relationship with WorkOrders.
  WorkOrder has one-to-many relationship with Executions.
  Each execution is tied to a process.

  Each product will have a separate WorkOrder.
  If a product has parallel processes, it will have multiple WorkOrders.
  i.e. 2401300007, 2401300007.01, 2401300007.01.01, 2401300007.01.02

  Tree structure of a sales order aggregate:
  SalesOrder 
    -> WorkOrder
    -> WorkOrder
    -> WorkOrder  
      -> Execution (step 1)
      -> Execution (step 2)
      -> Execution (step 3)
  */

@Injectable({
  providedIn: ProductionTrackingModule,
})
export class ProductionTrackingService {
  constructor(
    private http: HttpClient,
    private app: AppService
  ) {}

  public fetchSalesOrders$(factory: Factory, limit?: number) {
    let api: string;
    let queryParams = '';
    switch (factory) {
      case 'modelfactory':
        api = this.app.api.getMfSalesOrders;
        break;
      case 'microfactory':
        api = this.app.api.getMfSalesOrders;
        break;
    }

    if (limit) {
      queryParams = `?limit=${limit}`;
    }
    console.log(api);
    console.log(queryParams);
    // this.http.get<SalesOrder[]>(`${api}${queryParams}`)
    return of(salesOrder as SalesOrder[]).pipe(
      delay(1000),
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err))))
    );
  }

  public fetchWorkOrders$(factory: Factory, salesOrderIds: string[]) {
    let api: string;
    switch (factory) {
      case 'modelfactory':
        api = this.app.api.getMfWorkOrders;
        break;
      case 'microfactory':
        api = this.app.api.getMfWorkOrders;
        break;
    }
    console.log(api);

    const mockData: unknown[] = [];
    if (salesOrderIds.includes('IN-20240130-0003')) mockData.push(...workOrder1);
    if (salesOrderIds.includes('EX-240130-0002')) mockData.push(...workOrder2);

    // this.http.get<WorkOrder[]>(`${api}?salesOrderId=${salesOrderIds.join(',')}`)
    return of(mockData as WorkOrder[]).pipe(
      delay(1000),
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err))))
    );
  }

  public fetchExecutions$(factory: Factory, workOrderIds: string[]) {
    let api: string;
    switch (factory) {
      case 'modelfactory':
        api = this.app.api.postMfExecutions;
        break;
      case 'microfactory':
        api = this.app.api.postMfExecutions;
        break;
    }
    console.log(api);

    const mockData: unknown[] = [];

    if (workOrderIds.includes('2401300003')) mockData.push(...execution1);
    if (workOrderIds.includes('2401300007')) mockData.push(...execution2);
    // this.http.post<Execution[]>(api, { ID: workOrderIds })
    return of(mockData as Execution[]).pipe(
      delay(1000),
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err))))
    );
  }

  public fetchProcessTrackingMap$(_factory: Factory, productId: number | string) {
    return of(processTracking as ProcessTracking[]).pipe(
      delay(1000),
      catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))),
      map(res => {
        return res.find(row => row.productId === productId);
      })
    );
  }

  public getOrderStatus() {}
}
