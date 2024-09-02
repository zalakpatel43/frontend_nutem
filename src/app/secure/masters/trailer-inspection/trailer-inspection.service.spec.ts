import { TestBed } from '@angular/core/testing';

import { TrailerInspectionService } from './trailer-inspection.service';

describe('TrailerInspectionService', () => {
  let service: TrailerInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrailerInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
