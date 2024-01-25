import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTrackingComponent } from './resource-tracking.component';

describe('ResourceTrackingComponent', () => {
  let component: ResourceTrackingComponent;
  let fixture: ComponentFixture<ResourceTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceTrackingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
