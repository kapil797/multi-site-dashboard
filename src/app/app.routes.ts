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
  // {
  //   path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.MANAGEMENT_KPIS).substring(1),
  //   loadChildren: () => import('@mk/management-kpis.module').then(m => m.ManagementKpisModule),
  //   canMatch: [routeGuard()],
  //   data: {
  //     // roles: [Roles.PUBLIC],
  //   },
  // },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.MANAGEMENT_KPIS_ONE).substring(1),
    loadChildren: () => import('@mk1/management-kpis-one.module').then(m => m.ManagementKpisOneModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.MANAGEMENT_KPIS_TWO).substring(1),
    loadChildren: () => import('@mk2/management-kpis-two.module').then(m => m.ManagementKpisTwoModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.MANAGEMENT_KPIS_THREE).substring(1),
    loadChildren: () => import('@mk3/management-kpis-three.module').then(m => m.ManagementKpisThreeModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.MANAGEMENT_KPIS_FOUR).substring(1),
    loadChildren: () => import('@mk4/management-kpis-four.module').then(m => m.ManagementKpisFourModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.SUPPLIER_INFORMATION).substring(1),
    loadChildren: () => import('@si/supplier-information.module').then(m => m.SupplierInformationModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.FULFILLMENT).substring(1),
    loadChildren: () => import('@ful/fulfillment.module').then(m => m.FulfillmentModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.CRITICAL_ISSUES).substring(1),
    loadChildren: () => import('@ci/critical-issues.module').then(m => m.CriticalIssuesModule),
    canMatch: [routeGuard()],
    data: {
      // roles: [Roles.PUBLIC],
    },
  },
  {
    path: urlJoin(`:${RoutePaths.HOME}`, RoutePaths.FAVOURITES).substring(1),
    loadChildren: () => import('@fav/favourites.module').then(m => m.FavouritesModule),
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
