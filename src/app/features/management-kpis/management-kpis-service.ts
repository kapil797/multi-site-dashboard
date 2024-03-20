import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '@core/services/app.service';

import { ManagementKpisModule } from '@mk/management-kpis.module';
import { ManagementLayerOneData } from '@mk/management-kpis-model';
@Injectable({
  providedIn: ManagementKpisModule,
})
export class ManagementKpisService {
  constructor(
    private http: HttpClient,
    private app: AppService
  ) {}
  public fetchManagementKPILayerOneData$(factory: string, frequency: string) {
    const suffix = `/nexus?topic=GetManagementKPIs&Period=${frequency}`;
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get<ManagementLayerOneData[]>(api);
  }
  public fetchFinancialKPI$(factory: string, frequency: string) {
    const suffix = `/nexus?topic=GetFinancialKPIs&Period=${frequency}`;
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get(api);
  }
  public fetchCustomerSatisfaction$(factory: string, frequency: string) {
    const suffix = `/nexus?topic=GetCustomerSatisfactionKPIs&Period=${frequency}`;
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get(api);
  }
  public fetchInventoryKPI$(factory: string, transMonth: number) {
    const suffix = `/nexus/inventory-kpi?transMonth=${transMonth}`;
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get(api);
  }
  public fetchOperationKPI$(factory: string, frequency: string) {
    const suffix = `/nexus?topic=GetOperationsKPIs&Period=${frequency}`;
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get(api);
  }
  public fetchProductivityKPI$(factory: string, frequency: string) {
    const suffix = `/nexus?topic=GetProductivityKPIs&Period=${frequency}`;
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get(api);
  }
  public fetchSafetyKPI$(factory: string, frequency: string) {
    const suffix = `/nexus?topic=GetSafetyKPIs&Period=${frequency}`;
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get(api);
  }
}
