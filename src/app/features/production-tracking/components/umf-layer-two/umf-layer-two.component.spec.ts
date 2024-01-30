import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmfLayerTwoComponent } from './umf-layer-two.component';

describe('UmfLayerTwoComponent', () => {
  let component: UmfLayerTwoComponent;
  let fixture: ComponentFixture<UmfLayerTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UmfLayerTwoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UmfLayerTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
