import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidPreparationComponent } from './liquid-preparation.component';

describe('LiquidPreparationComponent', () => {
  let component: LiquidPreparationComponent;
  let fixture: ComponentFixture<LiquidPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidPreparationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiquidPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
