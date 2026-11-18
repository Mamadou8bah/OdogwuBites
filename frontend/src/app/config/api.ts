import { environment } from '../../environments/environment';

// Compare parsed origins and path boundaries, never hostname substrings.
export function isConfiguredApiRequest(url: string, baseUrl = environment.apiUrl): boolean {
  try {
    const target = new URL(url);
    const base = new URL(baseUrl);
    const basePath = base.pathname.replace(/\/+$/, '');
    return !target.username && !target.password &&
      target.origin === base.origin &&
      (target.pathname === basePath || target.pathname.startsWith(`${basePath}/`));
  } catch {
    return false;
  }
}
