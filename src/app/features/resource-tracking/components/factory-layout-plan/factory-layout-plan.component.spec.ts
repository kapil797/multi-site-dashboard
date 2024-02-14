import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryLayoutPlanComponent } from './factory-layout-plan.component';

describe('FactoryLayoutPlanComponent', () => {
  let component: FactoryLayoutPlanComponent;
  let fixture: ComponentFixture<FactoryLayoutPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryLayoutPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FactoryLayoutPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
