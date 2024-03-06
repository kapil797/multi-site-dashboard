import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPerformanceComponent } from './inventory-performance.component';

describe('InventoryPerformanceComponent', () => {
  let component: InventoryPerformanceComponent;
  let fixture: ComponentFixture<InventoryPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryPerformanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
