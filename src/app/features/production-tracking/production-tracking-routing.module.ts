import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutePaths } from '@core/constants/routes.constant';
import { MultiSiteComponent } from './multi-site/multi-site.component';

const routes: Routes = [
  {
    path: `:${RoutePaths.LAYER}`,
    component: MultiSiteComponent,
    data: { animationState: 'ProductionTrackingLayerPage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionTrackingRoutingModule {}
