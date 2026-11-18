import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { HomepageService } from './homepage';

describe('Homepage', () => {
  let service: HomepageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(HomepageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
