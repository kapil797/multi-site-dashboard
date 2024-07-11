import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Others1LargeComponent } from './others1-large.component';

describe('Others1LargeComponent', () => {
  let component: Others1LargeComponent;
  let fixture: ComponentFixture<Others1LargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Others1LargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Others1LargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
