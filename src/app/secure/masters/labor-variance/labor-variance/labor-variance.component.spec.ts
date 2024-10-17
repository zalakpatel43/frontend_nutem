import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborVarianceComponent } from './labor-variance.component';

describe('LaborVarianceComponent', () => {
  let component: LaborVarianceComponent;
  let fixture: ComponentFixture<LaborVarianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaborVarianceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaborVarianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
