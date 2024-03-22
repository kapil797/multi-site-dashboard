import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { initApp } from '@core/init/app.factory';
import { AppService } from '@core/services/app.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    // KeycloakService,
    { provide: APP_INITIALIZER, useFactory: initApp, deps: [AppService], multi: true },
  ],
};
