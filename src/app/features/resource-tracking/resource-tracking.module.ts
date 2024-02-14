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

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    CustomTableComponent,
    FactoryLayoutPlanComponent,
    ResourceConsumptionComponent,
  ],
  imports: [ResourceTrackingRoutingModule, SharedModule],
  providers: [ResourceTrackingService],
})
export class ResourceTrackingModule {}
