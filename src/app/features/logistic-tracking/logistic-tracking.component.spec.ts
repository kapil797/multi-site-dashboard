import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticTrackingComponent } from './logistic-tracking.component';

describe('LogisticTrackingComponent', () => {
  let component: LogisticTrackingComponent;
  let fixture: ComponentFixture<LogisticTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogisticTrackingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogisticTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
