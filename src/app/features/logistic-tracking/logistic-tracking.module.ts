import { NgModule } from '@angular/core';
import { LayerOneComponent } from '@lt/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@lt/components/layer-two/layer-two.component';
import { LayerResolverComponent } from '@lt/components/layer-resolver/layer-resolver.component';
import { TrackingMapComponent } from '@lt/components/tracking-map/tracking-map.component';
import { LogisticTrackingRoutingModule } from '@lt/logistic-tracking-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [LayerOneComponent, LayerTwoComponent, LayerResolverComponent, TrackingMapComponent],
  imports: [LogisticTrackingRoutingModule, SharedModule],
})
export class LogisticTrackingModule {}
