import { TestBed } from '@angular/core/testing';

import { Homepage } from './homepage';

describe('Homepage', () => {
  let service: Homepage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Homepage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
