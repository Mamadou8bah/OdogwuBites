import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { defer, finalize, timeout } from 'rxjs';
import { LoadingService } from '../service/loading.service';

const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Only track API calls; avoid showing loader for assets/CDN.
  const isApiRequest = req.url.includes('odogwubites.onrender.com');
  const skip = req.headers.has('x-skip-loading');
  const skipTimeout = req.headers.has('x-skip-timeout');

  if (!isApiRequest || skip) {
    return next(req);
  }

  // Ensure we only toggle the loader when the request is actually subscribed to.
  return defer(() => {
    loadingService.show();
    try {
      const stream$ = next(req);
      const timed$ = skipTimeout ? stream$ : stream$.pipe(timeout(DEFAULT_REQUEST_TIMEOUT_MS));
      return timed$.pipe(finalize(() => loadingService.hide()));
    } catch (e) {
      // Defensive: if something throws synchronously, don't leave the overlay stuck.
      loadingService.hide();
      throw e;
    }
  });
};
