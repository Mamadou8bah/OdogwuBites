import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { authInterceptor } from './auth.interceptor';
import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../service/loading.service';

describe('configured API interceptors', () => {
  let http: HttpClient;
  let requests: HttpTestingController;
  let loading: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    loading = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
      provideHttpClientTesting(),
      { provide: LoadingService, useValue: loading },
    ] });
    http = TestBed.inject(HttpClient);
    requests = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    requests.verify();
    localStorage.removeItem('token');
  });

  it('attaches a token and tracks loading for the configured API', () => {
    const url = `${environment.apiUrl}/auth/profile`;
    http.get(url).subscribe();
    const request = requests.expectOne(url);
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(loading.show).toHaveBeenCalledTimes(1);
    request.flush({});
    expect(loading.hide).toHaveBeenCalledTimes(1);
  });

  for (const url of [
    'https://evil.test/?next=odogwubites.onrender.com',
    'https://odogwubites.onrender.com.evil.test/auth',
    'http://localhost:3000.evil.test/auth',
    'http://localhost:3001/auth',
    'https://evil.test/localhost:3000',
  ]) {
    it(`never attaches a stored token or tracks external request ${url}`, () => {
      http.get(url).subscribe();
      const request = requests.expectOne(url);
      expect(request.request.headers.has('Authorization')).toBeFalse();
      request.flush({});
      expect(loading.show).not.toHaveBeenCalled();
      expect(loading.hide).not.toHaveBeenCalled();
    });
  }

  it('preserves explicit authorization on an API request', () => {
    const url = `${environment.apiUrl}/auth/profile`;
    http.get(url, { headers: new HttpHeaders({ Authorization: 'Bearer explicit' }) }).subscribe();
    const request = requests.expectOne(url);
    expect(request.request.headers.get('Authorization')).toBe('Bearer explicit');
    request.flush({});
  });

  it('does not attach an absent token and honors the loading opt-out', () => {
    localStorage.removeItem('token');
    const url = `${environment.apiUrl}/menu/all`;
    http.get(url, { headers: new HttpHeaders({ 'x-skip-loading': 'true' }) }).subscribe();
    const request = requests.expectOne(url);
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
    expect(loading.show).not.toHaveBeenCalled();
  });
});
