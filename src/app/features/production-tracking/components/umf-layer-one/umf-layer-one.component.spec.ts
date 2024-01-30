import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmfLayerOneComponent } from './umf-layer-one.component';

describe('UmfLayerOneComponent', () => {
  let component: UmfLayerOneComponent;
  let fixture: ComponentFixture<UmfLayerOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UmfLayerOneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UmfLayerOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
