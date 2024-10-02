export type Environment = 'DEVELOPMENT' | 'PRODUCTION' | 'TESTING';

export interface Config {
  ENVIRONMENT: Environment;
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT: string;
  MF_DASHBOARD_API_URL: string;
  MF_DASHBOARD_WEBSOCKET_URL: string;
  MF_RPS_URL: string;
  MF_RTD_URL: string;
  MF_ORDERAPP_URL: string;
  MF_DASHBOARD_MIDDLEWARE_URL: string;
  MAP_ACCESS_TOKEN: string;
  MAP_API_URL: string;
  ROUTE_API_URL: string;
  MACHINE_DATA_API: string;
}
