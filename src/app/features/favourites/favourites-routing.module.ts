import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutePaths } from '@core/constants/routes.constant';
import { MultiSiteComponent } from '@fav/multi-site/multi-site.component';

const routes: Routes = [
  {
    path: `:${RoutePaths.SITE}`,
    component: MultiSiteComponent,
    data: { animationState: 'ManagementKpisOneLayerPage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouritesRoutingModule {}
