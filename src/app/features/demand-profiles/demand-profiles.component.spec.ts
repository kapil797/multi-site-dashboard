import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandProfilesComponent } from './demand-profiles.component';

describe('DemandProfilesComponent', () => {
  let component: DemandProfilesComponent;
  let fixture: ComponentFixture<DemandProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandProfilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DemandProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
