import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightCheckComponent } from './weight-check.component';

describe('WeightCheckComponent', () => {
  let component: WeightCheckComponent;
  let fixture: ComponentFixture<WeightCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeightCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
