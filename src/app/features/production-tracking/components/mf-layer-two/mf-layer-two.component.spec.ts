import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfLayerTwoComponent } from './mf-layer-two.component';

describe('MfLayerTwoComponent', () => {
  let component: MfLayerTwoComponent;
  let fixture: ComponentFixture<MfLayerTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfLayerTwoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MfLayerTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
