import { Routes } from '@angular/router';

import { RoutePaths } from '@core/constants/routes.constant';
import { routeGuard } from '@core/guards/route.guard';
import { urlJoin } from '@core/utils/routing';

import { FallbackComponent } from '@core/components/fallback/fallback.component';
import { HeartbeatComponent } from '@core/components/heartbeat/heartbeat.component';
import { LandingComponent } from '@core/components/landing/landing.component';
import { UnauthorizedComponent } from '@core/components/unauthorized/unauthorized.component';

export const routes: Routes = [
  // Standalone.
  {
    path: RoutePaths.HEARTBEAT,
    component: HeartbeatComponent,
    data: { animationState: 'heartbeatPage' },
  },
  {
    path: `:${RoutePaths.HOME}`,
    component: LandingComponent,
    canMatch: [routeGuard()],
    data: { animationState: 'landingPage' },
  },

  // Lazy loading.
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.PRODUCTION_TRACKING).substring(1),
    loadChildren: () => import('@pt/production-tracking.module').then(m => m.ProductionTrackingModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.RESOURCE_TRACKING).substring(1),
    loadChildren: () => import('@rt/resource-tracking.module').then(m => m.ResourceTrackingModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.RESOURCE_HEALTH).substring(1),
    loadChildren: () => import('@rh/resource-health.module').then(m => m.ResourceHealthModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.PRODUCTION_INVENTORY).substring(1),
    loadChildren: () => import('@pi/production-and-inventory.module').then(m => m.ProductionAndInventoryModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.DEMAND_PROFILE).substring(1),
    loadChildren: () => import('@dp/demand-profile.module').then(m => m.DemandProfileModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.LOGISTIC_TRACKING).substring(1),
    loadChildren: () => import('@lt/logistic-tracking.module').then(m => m.LogisticTrackingModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.MANAGEMENT_KPIS).substring(1),
    loadChildren: () => import('@mk/management-kpis.module').then(m => m.ManagementKpisModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },

  // Redirects.
  { path: RoutePaths.BASE, redirectTo: RoutePaths.DEFAULT, pathMatch: 'full' },

  // Fallback.
  {
    path: RoutePaths.UNAUTHORIZED,
    component: UnauthorizedComponent,
    data: { animationState: 'unauthorizedPage' },
  },
  {
    path: '**',
    component: FallbackComponent,
    data: { animationState: 'fallbackPage' },
  },
];
