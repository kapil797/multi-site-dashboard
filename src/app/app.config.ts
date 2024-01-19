import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { KeycloakService } from 'keycloak-angular';

import { initApp } from '@core/init/app.factory';
import { AppService } from '@core/services/app.service';
import { initKeycloak } from '@core/init/keycloak.factory';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    KeycloakService,
    { provide: APP_INITIALIZER, useFactory: initApp, deps: [AppService], multi: true },
    { provide: APP_INITIALIZER, useFactory: initKeycloak, deps: [KeycloakService, AppService], multi: true },
  ],
};
