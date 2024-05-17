import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutTwoComponent } from './layout-two.component';

describe('LayoutTwoComponent', () => {
  let component: LayoutTwoComponent;
  let fixture: ComponentFixture<LayoutTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutTwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
