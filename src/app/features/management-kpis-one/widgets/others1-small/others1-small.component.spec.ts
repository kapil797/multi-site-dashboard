import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Others1SmallComponent } from './others1-small.component';

describe('Others1SmallComponent', () => {
  let component: Others1SmallComponent;
  let fixture: ComponentFixture<Others1SmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Others1SmallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Others1SmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
