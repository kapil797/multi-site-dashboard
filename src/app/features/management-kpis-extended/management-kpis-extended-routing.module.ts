import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutePaths } from '@core/constants/routes.constant';
import { MulitSiteComponent } from './mulit-site/mulit-site.component';

const routes: Routes = [
  {
    path: `:${RoutePaths.LAYER}`,
    component: MulitSiteComponent,
    data: { animationState: 'ManagementKpisExtendedLayerPage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementKpisExtendedRoutingModule {}
