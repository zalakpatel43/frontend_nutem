import { TestBed } from '@angular/core/testing';

import { AttributeCheckService } from './attribute-check.service';

describe('AttributeCheckService', () => {
  let service: AttributeCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
