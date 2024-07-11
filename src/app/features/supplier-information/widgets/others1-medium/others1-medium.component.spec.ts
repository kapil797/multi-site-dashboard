import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Others1MediumComponent } from './others1-medium.component';

describe('Others1MediumComponent', () => {
  let component: Others1MediumComponent;
  let fixture: ComponentFixture<Others1MediumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Others1MediumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Others1MediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
