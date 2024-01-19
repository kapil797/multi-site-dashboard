import { AppService } from '@core/services/app.service';

import { KeycloakService } from 'keycloak-angular';

export function initKeycloak(keycloak: KeycloakService, app: AppService) {
  return () => {
    return keycloak.init({
      config: {
        url: app.config.KEYCLOAK_URL,
        realm: app.config.KEYCLOAK_REALM,
        clientId: app.config.KEYCLOAK_CLIENT,
      },
      initOptions: {
        checkLoginIframe: false,
        // onLoad: 'check-sso',
        // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      },
    });
  };
}
