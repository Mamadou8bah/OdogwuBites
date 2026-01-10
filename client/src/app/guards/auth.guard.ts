import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

function buildLoginRedirect(returnUrl: string) {
  const router = inject(Router);
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl },
  });
}

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);

  if (auth.isAuthenticated() && auth.currentUser) return true;

  return buildLoginRedirect(state.url);
};

export const authChildGuard: CanActivateChildFn = (_childRoute, state) => {
  const auth = inject(AuthService);

  if (auth.isAuthenticated() && auth.currentUser) return true;

  return buildLoginRedirect(state.url);
};
