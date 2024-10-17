import { TestBed } from '@angular/core/testing';

import { LaborVarianceService } from './labor-variance.service';

describe('LaborVarianceService', () => {
  let service: LaborVarianceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaborVarianceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
