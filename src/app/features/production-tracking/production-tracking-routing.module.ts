import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { routePaths } from '@core/constants/routes.constant';
import { LayerOneComponent } from '@pt/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@pt/components/layer-two/layer-two.component';

const routes: Routes = [
  {
    path: routePaths.LAYER_ONE,
    component: LayerOneComponent,
    data: { animationState: 'ProductionTrackingLayerOnePage' },
  },
  {
    path: routePaths.LAYER_TWO,
    component: LayerTwoComponent,
    data: { animationState: 'ProductionTrackingLayerTwoPage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionTrackingRoutingModule {}
