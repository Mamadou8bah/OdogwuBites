import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { defer, finalize } from 'rxjs';
import { LoadingService } from '../service/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Only track API calls; avoid showing loader for assets/CDN.
  const isApiRequest = req.url.includes('odogwubites.onrender.com');
  const skip = req.headers.has('x-skip-loading');

  if (!isApiRequest || skip) {
    return next(req);
  }

  // Ensure we only toggle the loader when the request is actually subscribed to.
  return defer(() => {
    loadingService.show();
    try {
      return next(req).pipe(finalize(() => loadingService.hide()));
    } catch (e) {
      // Defensive: if something throws synchronously, don't leave the overlay stuck.
      loadingService.hide();
      throw e;
    }
  });
};
