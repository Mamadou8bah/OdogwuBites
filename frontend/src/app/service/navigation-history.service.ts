import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavigationHistoryService {
  private _currentUrl: string | null = null;
  private _previousUrl: string | null = null;

  constructor(private router: Router) {
    this._currentUrl = this.router.url;

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this._previousUrl = this._currentUrl;
        this._currentUrl = e.urlAfterRedirects;
      });
  }

  get currentUrl(): string | null {
    return this._currentUrl;
  }

  get previousUrl(): string | null {
    return this._previousUrl;
  }

  consumeReturnUrl(fallback: string = '/'): string {
    let prev = this._previousUrl;
    this._previousUrl = null;

    if (!prev) return fallback;
    if (prev.startsWith('/login')) return fallback;
    return prev;
  }

}
