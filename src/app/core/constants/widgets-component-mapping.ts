import { InventoryPerformance1SmallComponent } from '@pi/widgets/inventory-performance1-small/inventory-performance1-small.component';
import { ManagementKPI1SmallComponent } from '@mk1/widgets/management-kpi1-small/management-kpi1-small.component';
import { ManagementKPI2SmallComponent } from '@mk1/widgets/management-kpi2-small/management-kpi2-small.component';
import { ManagementKPI3SmallComponent } from '@mk1/widgets/management-kpi3-small/management-kpi3-small.component';
import { OrderStatusComponent } from '@lt/widgets/order-status/order-status.component';
import { ProductionYield1SmallComponent } from '@pi/widgets/production-yield1-small/production-yield1-small.component';
import { SupplierInventory1MediumComponent } from '@lt/widgets/supplier-inventory1-medium/supplier-inventory1-medium.component';
import { Fulfilment1SmallComponent } from '@ful/widgets/fulfilment1-small/fulfilment1-small.component';
import { InventoryValueCost1SmallComponent } from '@pi/widgets/inventory-value-cost1-small/inventory-value-cost1-small.component';
import { ProductionCapacity1SmallComponent } from '@pi/widgets/production-capacity1-small/production-capacity1-small.component';
import { MachineStatus1SmallComponent } from '@rt/widgets/machine-status1-small/machine-status1-small.component';
import { DemandForecast1SmallComponent } from '@ful/widgets/demand-forecast1-small/demand-forecast1-small.component';
import { ProductionTracking1LargeComponent } from '@pt/widgets/production-tracking1-large/production-tracking1-large.component';
import { GlobalShopfloorStatus1SmallComponent } from '@rt/widgets/global-shopfloor-status1-small/global-shopfloor-status1-small.component';
import { ProductionTracking2LargeComponent } from '@pt/widgets/production-tracking2-large/production-tracking2-large.component';
import { UtilTracking1SmallComponent } from '@rt/widgets/util-tracking1-small/util-tracking1-small.component';
import { CurrentOEE1SmallComponent } from '@rh/widgets/current-oee1-small/current-oee1-small.component';
import { MonthlyOEE1MediumComponent } from '@rh/widgets/monthly-oee1-medium/monthly-oee1-medium.component';
import { ResourceEfficiencies1SmallComponent } from '@rh/widgets/resource-efficiencies1-small/resource-efficiencies1-small.component';
import { Others1SmallComponent } from '@mk1/widgets/others1-small/others1-small.component';
import { Others1MediumComponent } from '@si/widgets/others1-medium/others1-medium.component';
import { Others1LargeComponent } from '@pt/widgets/others1-large/others1-large.component';

export const widgetComponentsMapping = {
  orderStatus: OrderStatusComponent,
  managementKPI1Small: ManagementKPI1SmallComponent,
  managementKPI2Small: ManagementKPI2SmallComponent,
  managementKPI3Small: ManagementKPI3SmallComponent,
  fulfillment1Small: Fulfilment1SmallComponent,
  productionYield1Small: ProductionYield1SmallComponent,
  inventoryPerformance1Small: InventoryPerformance1SmallComponent,
  supplierInventory1Medium: SupplierInventory1MediumComponent,
  inventoryValueCost1Small: InventoryValueCost1SmallComponent,
  productionCapacity1Small: ProductionCapacity1SmallComponent,
  machineStatus1Small: MachineStatus1SmallComponent,
  demandForecast1Small: DemandForecast1SmallComponent,
  productionTracking1Large: ProductionTracking1LargeComponent,
  globalShopfloorStatus1Small: GlobalShopfloorStatus1SmallComponent,
  productionTracking2Large: ProductionTracking2LargeComponent,
  utilTracking1Small: UtilTracking1SmallComponent,
  currentOEE1Small: CurrentOEE1SmallComponent,
  monthlyOEE1Medium: MonthlyOEE1MediumComponent,
  resourceEfficiencies1Small: ResourceEfficiencies1SmallComponent,
  others1Small: Others1SmallComponent,
  others1Medium: Others1MediumComponent,
  others1Large: Others1LargeComponent,
};
