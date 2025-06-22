import { TestBed } from '@angular/core/testing';

import { ContractTreeService } from './contract-tree.service';

describe('ContractTreeService', () => {
  let service: ContractTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
