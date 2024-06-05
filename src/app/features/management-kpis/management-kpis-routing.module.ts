import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutePaths } from '@core/constants/routes.constant';
import { MulitSiteComponent } from './mulit-site/mulit-site.component';

const routes: Routes = [
  {
    path: `:${RoutePaths.SITE}`,
    component: MulitSiteComponent,
    data: { animationState: 'ManagementKpisLayerPage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementKpisRoutingModule {}
