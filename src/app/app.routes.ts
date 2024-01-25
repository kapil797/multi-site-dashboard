import { Routes } from '@angular/router';

import { AuthGuard } from '@core/auth/auth.guard';
import { roles } from '@core/auth/roles.constant';
import { FallbackComponent } from '@core/components/fallback/fallback.component';
import { LandingComponent } from '@core/components/landing/landing.component';
import { UnauthorizedComponent } from '@core/components/unauthorized/unauthorized.component';
import { routePaths } from '@core/constants/routes.constant';
import { routeGuard } from '@core/guards/route.guard';
import { urlJoin } from '@core/utils/routing';

export const routes: Routes = [
  // Standalone.
  {
    path: routePaths.HOME,
    component: LandingComponent,
    canActivate: [AuthGuard],
    canMatch: [routeGuard()],
    data: { animationState: 'landingPage' },
  },

  // Lazy loading.
  {
    path: urlJoin(routePaths.HOME, routePaths.PRODUCTION_TRACKING_ONE).substring(1),
    loadChildren: () => import('@pt/production-tracking.module').then(m => m.ProductionTrackingModule),
    canMatch: [routeGuard()],
    canActivate: [AuthGuard],
    data: {
      roles: [roles.PUBLIC],
    },
  },

  // Redirects.
  { path: routePaths.BASE, redirectTo: routePaths.DEFAULT, pathMatch: 'full' },

  // Fallback.
  {
    path: routePaths.UNAUTHORIZED,
    component: UnauthorizedComponent,
    canActivate: [AuthGuard],
    data: { animationState: 'unauthorizedPage' },
  },
  {
    path: '**',
    component: FallbackComponent,
    canActivate: [AuthGuard],
    data: { animationState: 'fallbackPage' },
  },
];
