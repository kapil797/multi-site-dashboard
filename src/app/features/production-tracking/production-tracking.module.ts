import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProductionTrackingRoutingModule } from '@pt/production-tracking-routing.module';
import { LayerOneComponent } from '@pt/components/layer-one/layer-one.component';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { LayerTwoComponent } from '@pt/components/layer-two/layer-two.component';
import { NavigationComponent } from '@pt/components/navigation/navigation.component';

@NgModule({
  declarations: [LayerOneComponent, LayerTwoComponent, NavigationComponent],
  imports: [ProductionTrackingRoutingModule, SharedModule],
  providers: [ProductionTrackingService],
})
export class ProductionTrackingModule {}
