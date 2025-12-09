import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import Keycloak from 'keycloak-js';

export const AuthGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const keycloak = inject(Keycloak);

  if (!keycloak.authenticated) {
    await keycloak.login({
      redirectUri: window.location.origin,
    });
    return false;
  }

  const requiredRoles = route.data['roles'] as Array<string>;
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  const userRoles = keycloak.realmAccess?.roles || [];
  const hasRole = requiredRoles.some((role) => userRoles.includes(role));

  if (hasRole) {
    return true;
  }

  alert('Non hai i permessi!');
  return false;
};
