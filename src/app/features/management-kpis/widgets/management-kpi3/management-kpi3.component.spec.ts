import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementKPI3Component } from './management-kpi3.component';

describe('ManagementKPI3Component', () => {
  let component: ManagementKPI3Component;
  let fixture: ComponentFixture<ManagementKPI3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementKPI3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagementKPI3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
