import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutePaths } from '@core/constants/routes.constant';
import { LayerResolverComponent } from '@pi/components/layer-resolver/layer-resolver.component';

const routes: Routes = [
  {
    path: `:${RoutePaths.LAYER}`,
    component: LayerResolverComponent,
    data: { animationState: 'ProductionInventoryLayerPage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionAndInventoryRoutingModule {}
