import { TestBed } from '@angular/core/testing';

import { FilterVisibilityService } from './filter-visibility.service';

describe('FilterVisibilityService', () => {
  let service: FilterVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
