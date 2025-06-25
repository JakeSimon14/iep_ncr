import { TestBed } from '@angular/core/testing';

import { SelectedContractService } from './selected-contract.service';

describe('SelectedContractService', () => {
  let service: SelectedContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
