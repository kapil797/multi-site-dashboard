import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

import { routePaths } from '@core/constants/routes.constant';
import { AuthService } from '@core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    override readonly router: Router,
    private readonly keycloakService: KeycloakService,
    private authService: AuthService
  ) {
    super(router, keycloakService);
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Force the user to log in if currently unauthenticated.
    // Difficult to support login initiated by the user as keycloak
    // will auto-redirect to login page if token has expired/missing when user
    // refreshes page. Not able to perform silent login and discard if failed
    // i.e. auto login required.
    if (!this.authenticated) {
      await this.keycloakService.login({
        redirectUri: window.location.origin + state.url,
      });
    }

    // To initialize variables after first login only.
    this.authService.userProfile$.pipe(take(1)).subscribe(res => {
      if (res) return;
      this.authService.initAfterLogIn();
    });

    if (!this.validateRoles(route)) {
      this.router.navigate([routePaths.UNAUTHORIZED]);
      return false;
    }
    return true;
  }

  private validateRoles(route: ActivatedRouteSnapshot) {
    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every(role => this.roles.includes(role));
  }
}
