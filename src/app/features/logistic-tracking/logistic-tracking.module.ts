import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerOneComponent } from '@lt/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@lt/components/layer-two/layer-two.component';
import { LayerResolverComponent } from '@lt/components/layer-resolver/layer-resolver.component';
import { TrackingMapComponent } from './components/tracking-map/tracking-map.component';

@NgModule({
  declarations: [LayerOneComponent, LayerTwoComponent, LayerResolverComponent, TrackingMapComponent],
  imports: [CommonModule],
})
export class LogisticTrackingModule {}
