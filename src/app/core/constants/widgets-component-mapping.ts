import { InventoryPerformance1Component } from '@lt/widgets/inventory-performance1/inventory-performance1.component';
import { ManagementKPI3Component } from '@lt/widgets/management-kpi3/management-kpi3.component';
import { OrderStatusComponent } from '@lt/widgets/order-status/order-status.component';
import { ProductionYield1Component } from '@lt/widgets/production-yield1/production-yield1.component';
import { SupplierInventory1Component } from '@lt/widgets/supplier-inventory1/supplier-inventory1.component';
import { Fulfilment1Component } from '@rt/widgets/fulfilment1/fulfilment1.component';
import { MachineStatus1Component } from '@rt/widgets/machine-status1/machine-status1.component';

export const widgetComponentsMapping = {
  orderStatus: OrderStatusComponent,
  ManagementKPI3: ManagementKPI3Component,
  fulfilment1: Fulfilment1Component,
  ProductionYield1: ProductionYield1Component,
  InventoryPerformance1: InventoryPerformance1Component,
  SupplierInventory1: SupplierInventory1Component,
  machineStatus1: MachineStatus1Component,
};
