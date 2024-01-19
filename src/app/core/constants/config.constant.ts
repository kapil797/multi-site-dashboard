export type Environment = 'DEVELOPMENT' | 'PRODUCTION' | 'TESTING';

export interface Config {
  ENVIRONMENT: Environment;
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT: string;
  KEYCLOAK_DEFAULT_USER: string;
  KEYCLOAK_DEFAULT_PASSWORD: string;
}
