import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If already logged in, keep them out of /login.
  if (auth.isAuthenticated() && auth.currentUser) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
