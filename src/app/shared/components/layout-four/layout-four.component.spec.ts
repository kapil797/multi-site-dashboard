import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutFourComponent } from './layout-four.component';

describe('LayoutFourComponent', () => {
  let component: LayoutFourComponent;
  let fixture: ComponentFixture<LayoutFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutFourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
