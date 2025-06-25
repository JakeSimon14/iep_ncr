import { TestBed } from '@angular/core/testing';

import { QualityActivityService } from './quality-activity.service';

describe('QualityActivityService', () => {
  let service: QualityActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualityActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
