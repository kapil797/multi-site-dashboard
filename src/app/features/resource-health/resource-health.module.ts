import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ResourceHealthRoutingModule } from '@rh/resource-health-routing.module';

import { ResourceHealthService } from '@rh/resource-health.service';

import { LayerResolverComponent } from '@rh/components/layer-resolver/layer-resolver.component';

import { LayerTwoComponent } from '@rh/components/layer-two/layer-two.component';
import { OverallResourceHealthComponent } from '@rh/components/overall-resource-health/overall-resource-health.component';
import { TransposedTableComponent } from '@rh/components/transposed-table/transposed-table.component';
import { CustomTableComponent } from '@rh/components/custom-table/custom-table.component';
import { MachineConsumptionComponent } from '@rh/components/machine-consumption/machine-consumption.component';
import { LayerOneComponent } from '@rh/components/layer-one/layer-one.component';
import { FeatureService } from '@core/services/feature.service';
import { CurrentOEE1Component } from './widgets/current-oee1/current-oee1.component';
import { MonthlyOEE1Component } from './widgets/monthly-oee1/monthly-oee1.component';
import { ResourceEfficiencies1Component } from './widgets/resource-efficiencies1/resource-efficiencies1.component';


@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    OverallResourceHealthComponent,
    TransposedTableComponent,
    CustomTableComponent,
    MachineConsumptionComponent,
    CurrentOEE1Component,
    MonthlyOEE1Component,
    ResourceEfficiencies1Component
  ],
  imports: [SharedModule, ResourceHealthRoutingModule],
  providers: [ResourceHealthService, FeatureService],
})
export class ResourceHealthModule {}
