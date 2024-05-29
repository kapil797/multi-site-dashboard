import { InventoryPerformance1Component } from '@pi/widgets/inventory-performance1/inventory-performance1.component';
import { ManagementKPI1Component } from '@lt/widgets/management-kpi1/management-kpi1.component';
import { ManagementKPI2Component } from '@lt/widgets/management-kpi2/management-kpi2.component';
import { ManagementKPI3Component } from '@lt/widgets/management-kpi3/management-kpi3.component';
import { OrderStatusComponent } from '@lt/widgets/order-status/order-status.component';
import { ProductionYield1Component } from '@lt/widgets/production-yield1/production-yield1.component';
import { SupplierInventory1Component } from '@lt/widgets/supplier-inventory1/supplier-inventory1.component';
import { Fulfilment1Component } from '@rt/widgets/fulfilment1/fulfilment1.component';
import { InventoryValueCost1Component } from '@pi/widgets/inventory-value-cost1/inventory-value-cost1.component';
import { ProductionCapacity1Component } from '@pi/widgets/production-capacity1/production-capacity1.component';
import { MachineStatus1Component } from '@rt/widgets/machine-status1/machine-status1.component';
import { DemandForecast1Component } from '@lt/widgets/demand-forecast1/demand-forecast1.component';
import { ProductionTracking1Component } from '@lt/widgets/production-tracking1/production-tracking1.component';
import { GlobalShopfloorStatus1Component } from '@lt/widgets/global-shopfloor-status1/global-shopfloor-status1.component';

export const widgetComponentsMapping = {
  orderStatus: OrderStatusComponent,
  ManagementKPI1: ManagementKPI1Component,
  ManagementKPI2: ManagementKPI2Component,
  ManagementKPI3: ManagementKPI3Component,
  fulfilment1: Fulfilment1Component,
  ProductionYield1: ProductionYield1Component,
  InventoryPerformance1: InventoryPerformance1Component,
  SupplierInventory1: SupplierInventory1Component,
  InventoryValueCost1: InventoryValueCost1Component,
  ProductionCapacity1: ProductionCapacity1Component,
  MachineStatus1: MachineStatus1Component,
  DemandForecast1: DemandForecast1Component,
  productionTracking1: ProductionTracking1Component,
  globalShopfloorStatus1: GlobalShopfloorStatus1Component,
};
