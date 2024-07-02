import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutePaths } from '@core/constants/routes.constant';
import { MultiSiteComponent } from '@mk2/multi-site/multi-site.component';

const routes: Routes = [
  {
    path: `:${RoutePaths.SITE}`,
    component: MultiSiteComponent,
    data: { animationState: 'ManagementKpisTwoLayerPage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementKpisTwoRoutingModule {}
