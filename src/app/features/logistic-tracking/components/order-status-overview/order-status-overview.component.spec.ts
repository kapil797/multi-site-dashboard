import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusOverviewComponent } from './order-status-overview.component';

describe('OrderStatusOverviewComponent', () => {
  let component: OrderStatusOverviewComponent;
  let fixture: ComponentFixture<OrderStatusOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
