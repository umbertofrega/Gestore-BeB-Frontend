import {provideRouter} from '@angular/router';
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {
  provideKeycloak,
} from 'keycloak-angular';

import {routes} from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
     provideKeycloak({
      config: {
        url: 'http://localhost:8081',
        realm: 'GestoreBeb',
        clientId: 'angular-client'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        enableLogging: true
      }

    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ]
};
