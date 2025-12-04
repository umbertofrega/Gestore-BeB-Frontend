import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import Keycloak from 'keycloak-js';

export const AuthGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const keycloak = inject(Keycloak);

  const authenticated = keycloak.authenticated;

  if (!authenticated) {
    await keycloak.login({
      redirectUri: window.location.origin + state.url,
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
