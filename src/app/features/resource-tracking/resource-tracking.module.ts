import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ResourceTrackingRoutingModule } from '@rt/resource-tracking-routing.module';

import { ResourceTrackingService } from '@rt/resource-tracking.service';

import { LayerResolverComponent } from '@rt/components/layer-resolver/layer-resolver.component';
import { LayerOneComponent } from '@rt/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@rt/components/layer-two/layer-two.component';
import { CustomTableComponent } from '@rt/components/custom-table/custom-table.component';
import { FactoryLayoutPlanComponent } from '@rt/components/factory-layout-plan/factory-layout-plan.component';
import { ResourceConsumptionComponent } from '@rt/components/resource-consumption/resource-consumption.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { MachineStatus1SmallComponent } from './widgets/machine-status1-small/machine-status1-small.component';
import { UtilTracking1SmallComponent } from './widgets/util-tracking1-small/util-tracking1-small.component';
import { FeatureService } from '@core/services/feature.service';
import { GlobalShopfloorStatus1SmallComponent } from './widgets/global-shopfloor-status1-small/global-shopfloor-status1-small.component';

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    CustomTableComponent,
    FactoryLayoutPlanComponent,
    ResourceConsumptionComponent,
    MultiSiteComponent,
    MachineStatus1SmallComponent,
    UtilTracking1SmallComponent,
    GlobalShopfloorStatus1SmallComponent
  ],
  imports: [ResourceTrackingRoutingModule, SharedModule],
  providers: [ResourceTrackingService, FeatureService],
})
export class ResourceTrackingModule {}
