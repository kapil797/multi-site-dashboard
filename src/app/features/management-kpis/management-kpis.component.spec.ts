import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementKpisComponent } from './management-kpis.component';

describe('ManagementKpisComponent', () => {
  let component: ManagementKpisComponent;
  let fixture: ComponentFixture<ManagementKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementKpisComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
