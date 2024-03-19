export type Environment = 'DEVELOPMENT' | 'PRODUCTION' | 'TESTING';

export interface Config {
  ENVIRONMENT: Environment;
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT: string;
  MF_DASHBOARD_WEBSOCKET_URL: string;
  MF_RPS_URL: string;
  MF_RTD_URL: string;
  MF_ORDERAPP_URL: string;
}
