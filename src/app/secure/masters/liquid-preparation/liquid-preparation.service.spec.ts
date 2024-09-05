import { TestBed } from '@angular/core/testing';

import { LiquidPreparationService } from './liquid-preparation.service';

describe('LiquidPreparationService', () => {
  let service: LiquidPreparationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiquidPreparationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
