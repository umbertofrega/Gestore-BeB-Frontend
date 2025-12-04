import {IncludeBearerTokenCondition, includeBearerTokenInterceptor, provideKeycloak} from 'keycloak-angular';
import {
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
} from 'keycloak-angular';
import { provideRouter } from '@angular/router';
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';



const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:8080\/api)(\/.*)?$/i
});

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      realm: 'GestoreBeb',
      url: 'http://localhost:8081',
      clientId: 'angular-client'
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `./assets/silent-check-sso.html`,
      redirectUri: window.location.origin + '/'
    },
    providers: [
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [localhostCondition]
      }
    ]
  });

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeycloakAngular(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])) //
  ]
};
