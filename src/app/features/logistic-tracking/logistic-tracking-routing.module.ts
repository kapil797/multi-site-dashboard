import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutePaths } from '@core/constants/routes.constant';
import { LayerResolverComponent } from '@lt/components/layer-resolver/layer-resolver.component';

const routes: Routes = [
  {
    path: `:${RoutePaths.LAYER}`,
    component: LayerResolverComponent,
    data: { animationState: 'LogisticTrackingLayerPage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogisticTrackingRoutingModule {}
