import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleStatusComponent } from './circle-status.component';

describe('CircleStatusComponent', () => {
  let component: CircleStatusComponent;
  let fixture: ComponentFixture<CircleStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
