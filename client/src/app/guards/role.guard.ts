import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated() || !auth.currentUser) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    const role = (auth.currentUser.role ?? '').toString().toLowerCase();
    const allowed = new Set(allowedRoles.map((r) => r.toLowerCase()));

    if (allowed.has(role)) return true;

    // Logged in but not authorized for this route.
    return router.createUrlTree(['/dashboard']);
  };
}

export const adminGuard: CanActivateFn = roleGuard(['admin']);
