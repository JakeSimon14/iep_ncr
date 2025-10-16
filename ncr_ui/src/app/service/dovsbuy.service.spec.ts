import { TestBed } from '@angular/core/testing';

import { DovsbuyService } from './dovsbuy.service';

describe('DovsbuyService', () => {
  let service: DovsbuyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DovsbuyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
