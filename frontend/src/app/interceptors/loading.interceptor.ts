import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../service/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Only track API calls; avoid showing loader for assets/CDN.
  const isApiRequest = req.url.includes('localhost:3000');
  const skip = req.headers.has('x-skip-loading');

  if (!isApiRequest || skip) {
    return next(req);
  }

  loadingService.show();
  return next(req).pipe(finalize(() => loadingService.hide()));
};
