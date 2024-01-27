import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProductionTrackingRoutingModule } from '@pt/production-tracking-routing.module';
import { MfLayerOneComponent } from '@pt/components/mf-layer-one/mf-layer-one.component';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { MfLayerTwoComponent } from '@pt/components/mf-layer-two/mf-layer-two.component';
import { NavigationComponent } from '@pt/components/navigation/navigation.component';

@NgModule({
  declarations: [MfLayerOneComponent, MfLayerTwoComponent, NavigationComponent],
  imports: [ProductionTrackingRoutingModule, SharedModule],
  providers: [ProductionTrackingService],
})
export class ProductionTrackingModule {}
