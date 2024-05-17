import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutFiveComponent } from './layout-five.component';

describe('LayoutFiveComponent', () => {
  let component: LayoutFiveComponent;
  let fixture: ComponentFixture<LayoutFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutFiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
