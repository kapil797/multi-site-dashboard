import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProductionAndInventoryRoutingModule } from '@pi/production-and-inventory-routing.module';

import { ProductionAndInventoryService } from '@pi/production-and-inventory.service';

import { LayerOneComponent } from '@pi/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@pi/components/layer-two/layer-two.component';
import { LayerResolverComponent } from '@pi/components/layer-resolver/layer-resolver.component';
import { InventoryPerformanceComponent } from '@pi/components/inventory-performance/inventory-performance.component';
import { ProductionPerformanceComponent } from '@pi/components/production-performance/production-performance.component';
import { ProgressPerformanceComponent } from '@pi/components/progress-performance/progress-performance.component';
import { ProductionCapacity1Component } from './widgets/production-capacity1/production-capacity1.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';

@NgModule({
  declarations: [
    LayerOneComponent,
    LayerTwoComponent,
    LayerResolverComponent,
    InventoryPerformanceComponent,
    ProductionPerformanceComponent,
    ProgressPerformanceComponent,
    ProductionCapacity1Component,
    MultiSiteComponent,
  ],
  imports: [SharedModule, ProductionAndInventoryRoutingModule],
  providers: [ProductionAndInventoryService],
})
export class ProductionAndInventoryModule {}
