import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LayerOneComponent } from '@pt/components/layer-one/layer-one.component';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { LayerTwoComponent } from '@pt/components/layer-two/layer-two.component';

@NgModule({
  declarations: [LayerOneComponent, LayerTwoComponent],
  imports: [SharedModule],
  exports: [LayerOneComponent],
  providers: [ProductionTrackingService],
})
export class ProductionTrackingModule {}
