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
import { Fulfilment1Component } from './widgets/fulfilment1/fulfilment1.component';
import { MachineStatus1Component } from './widgets/machine-status1/machine-status1.component';
import { UtilTracking1Component } from './widgets/util-tracking1/util-tracking1.component';
import { FeatureService } from '@core/services/feature.service';

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    CustomTableComponent,
    FactoryLayoutPlanComponent,
    ResourceConsumptionComponent,
    MultiSiteComponent,
    Fulfilment1Component,
    MachineStatus1Component,
    UtilTracking1Component
  ],
  imports: [ResourceTrackingRoutingModule, SharedModule],
  providers: [ResourceTrackingService, FeatureService],
})
export class ResourceTrackingModule {}
