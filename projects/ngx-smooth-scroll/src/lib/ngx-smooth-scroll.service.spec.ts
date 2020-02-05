import { TestBed } from '@angular/core/testing';

import { NgxSmoothScrollService } from './ngx-smooth-scroll.service';

describe('NgxSmoothScrollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxSmoothScrollService = TestBed.get(NgxSmoothScrollService);
    expect(service).toBeTruthy();
  });
});
