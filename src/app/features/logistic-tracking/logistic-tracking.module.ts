import { NgModule } from '@angular/core';
import { LayerOneComponent } from '@lt/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@lt/components/layer-two/layer-two.component';
import { LayerResolverComponent } from '@lt/components/layer-resolver/layer-resolver.component';
import { TrackingMapComponent } from '@lt/components/tracking-map/tracking-map.component';
import { LogisticTrackingRoutingModule } from '@lt/logistic-tracking-routing.module';
import { SharedModule } from '@shared/shared.module';
import { LogisticTrackingService } from './logistic-tracking-service';
import { DeliveryProgressComponent } from '@lt/components/delivery-progress/delivery-progress.component';
import { OrderStatusOverviewComponent } from '@lt/components/order-status-overview/order-status-overview.component';
import { OrderStatusIndividualComponent } from './components/order-status-individual/order-status-individual.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { FeatureService } from '@core/services/feature.service';
import { OrderStatusComponent } from './widgets/order-status/order-status.component';
import { ManagementKPI1Component } from './widgets/management-kpi1/management-kpi1.component';
import { ManagementKPI2Component } from './widgets/management-kpi2/management-kpi2.component';
import { ManagementKPI3Component } from './widgets/management-kpi3/management-kpi3.component';
import { ProductionYield1Component } from './widgets/production-yield1/production-yield1.component';
import { SupplierInventory1Component } from './widgets/supplier-inventory1/supplier-inventory1.component';
import { InventoryPerformance1Component } from '../production-and-inventory/widgets/inventory-performance1/inventory-performance1.component';
import { Fulfilment1Component } from './widgets/fulfilment1/fulfilment1.component';
import { GlobalShopfloorStatus1Component } from './widgets/global-shopfloor-status1/global-shopfloor-status1.component';

@NgModule({
  declarations: [
    LayerOneComponent,
    LayerTwoComponent,
    LayerResolverComponent,
    TrackingMapComponent,
    DeliveryProgressComponent,
    OrderStatusOverviewComponent,
    OrderStatusIndividualComponent,
    MultiSiteComponent,
    OrderStatusComponent,
    ManagementKPI1Component,
    ManagementKPI2Component,
    ManagementKPI3Component,
    ProductionYield1Component,
    SupplierInventory1Component,
    InventoryPerformance1Component,
    Fulfilment1Component,
    GlobalShopfloorStatus1Component,
  ],
  imports: [LogisticTrackingRoutingModule, SharedModule],
  providers: [LogisticTrackingService, FeatureService],
})
export class LogisticTrackingModule {}
