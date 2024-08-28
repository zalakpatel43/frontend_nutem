import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeCHeckComponent } from './attribute-check.component';

describe('AttributeCHeckComponent', () => {
  let component: AttributeCHeckComponent;
  let fixture: ComponentFixture<AttributeCHeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeCHeckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttributeCHeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
