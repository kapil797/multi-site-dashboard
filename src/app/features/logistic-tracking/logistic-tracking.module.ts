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
import { LayoutOneComponent } from 'src/app/layouts/layout-one/layout-one.component';
import { ManagementKPI3Component } from './widgets/management-kpi3/management-kpi3.component';
import { ProductionYield1Component } from './widgets/production-yield1/production-yield1.component';
import { LayoutTwoComponent } from 'src/app/layouts/layout-two/layout-two.component';
import { LayoutSixComponent } from 'src/app/layouts/layout-six/layout-six.component';
import { LayoutThreeComponent } from 'src/app/layouts/layout-three/layout-three.component';
import { LayoutFourComponent } from 'src/app/layouts/layout-four/layout-four.component';
import { LayoutFiveComponent } from 'src/app/layouts/layout-five/layout-five.component';
import { SupplierInventory1Component } from './widgets/supplier-inventory1/supplier-inventory1.component';

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
    LayoutOneComponent,
    LayoutTwoComponent,
    ManagementKPI3Component,
    ProductionYield1Component,
    SupplierInventory1Component,
    LayoutSixComponent,
    LayoutThreeComponent,
    LayoutFourComponent,
    LayoutFiveComponent,
  ],
  imports: [LogisticTrackingRoutingModule, SharedModule],
  providers: [LogisticTrackingService, FeatureService],
})
export class LogisticTrackingModule {}
