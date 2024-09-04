import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerInspectionComponent } from './trailer-inspection.component';

describe('TrailerInspectionComponent', () => {
  let component: TrailerInspectionComponent;
  let fixture: ComponentFixture<TrailerInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerInspectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrailerInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
