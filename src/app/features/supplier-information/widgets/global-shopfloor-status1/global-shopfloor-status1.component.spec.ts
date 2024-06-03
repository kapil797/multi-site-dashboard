import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalShopfloorStatus1Component } from './global-shopfloor-status1.component';

describe('GlobalShopfloorStatus1Component', () => {
  let component: GlobalShopfloorStatus1Component;
  let fixture: ComponentFixture<GlobalShopfloorStatus1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalShopfloorStatus1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalShopfloorStatus1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
