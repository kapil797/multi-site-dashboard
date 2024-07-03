import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalShopfloorStatus1SmallComponent } from './global-shopfloor-status1-small.component';

describe('GlobalShopfloorStatus1Component', () => {
  let component: GlobalShopfloorStatus1SmallComponent;
  let fixture: ComponentFixture<GlobalShopfloorStatus1SmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalShopfloorStatus1SmallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalShopfloorStatus1SmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
