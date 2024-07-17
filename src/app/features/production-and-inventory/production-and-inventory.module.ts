import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProductionAndInventoryRoutingModule } from '@pi/production-and-inventory-routing.module';

import { LayerOneComponent } from '@pi/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@pi/components/layer-two/layer-two.component';
import { LayerResolverComponent } from '@pi/components/layer-resolver/layer-resolver.component';
import { ProductionPerformanceComponent } from '@pi/components/production-performance/production-performance.component';
import { ProgressPerformanceComponent } from '@pi/components/progress-performance/progress-performance.component';
import { ProductionCapacity1SmallComponent } from './widgets/production-capacity1-small/production-capacity1-small.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { ProductionYield1SmallComponent } from './widgets/production-yield1-small/production-yield1-small.component';
import { FeatureService } from '@core/services/feature.service';
import { ProductionAndInventoryService } from './production-and-inventory.service';
import { InventoryPerformance1SmallComponent } from './widgets/inventory-performance1-small/inventory-performance1-small.component';
import { InventoryValueCost1SmallComponent } from './widgets/inventory-value-cost1-small/inventory-value-cost1-small.component';
import { InventoryPerformanceComponent } from './components/inventory-performance/inventory-performance.component';

@NgModule({
  declarations: [
    LayerOneComponent,
    LayerTwoComponent,
    LayerResolverComponent,
    InventoryPerformanceComponent,
    ProductionPerformanceComponent,
    InventoryPerformance1SmallComponent,
    InventoryValueCost1SmallComponent,
    ProductionPerformanceComponent,
    ProgressPerformanceComponent,
    ProductionCapacity1SmallComponent,
    ProductionYield1SmallComponent,
    MultiSiteComponent,
  ],
  imports: [SharedModule, ProductionAndInventoryRoutingModule],
  providers: [ProductionAndInventoryService, FeatureService],
})
export class ProductionAndInventoryModule {}
