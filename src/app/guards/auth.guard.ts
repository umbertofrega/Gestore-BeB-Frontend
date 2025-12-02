import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AuthGuardData, createAuthGuard} from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {

  const { authenticated, grantedRoles } = authData;
  const router = inject(Router);
  const requiredRole = route.data['role'];
  const hasRequiredRole = (role: string): boolean =>
    Object.values(grantedRoles.resourceRoles).some((roles) => roles.includes(role));

  if (!requiredRole) {
    console.error("ERRORE DI CONFIGURAZIONE: Rotta protetta senza ruolo specificato.");
    return router.parseUrl('/error');
  }



  if (authenticated && hasRequiredRole(requiredRole)) {
    return true;
  }


  return router.parseUrl('/forbidden');


};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);
