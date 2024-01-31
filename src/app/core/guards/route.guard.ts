import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';

import { Factory, factories } from '@core/models/factory.model';
import { AppService } from '@core/services/app.service';

export const routeGuard = (): CanMatchFn => {
  // The base route has a dynamic param which needs to be checked for every route.
  // To be used in canUse() or canLoad() to skip current route and check others in
  // the routing table.
  return (_route: Route, segments: UrlSegment[]) => {
    const app = inject(AppService);
    if (segments.length === 0) return false;
    const factory = segments[0].path as Factory;
    if (!factory || !factories.includes(factory)) return false;
    app.factory$.next(factory);
    return true;
  };
};
