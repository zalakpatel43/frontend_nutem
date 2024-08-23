import { TestBed } from '@angular/core/testing';

import { WeightCheckService } from './weight-check.service';

describe('WeightCheckService', () => {
  let service: WeightCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeightCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
