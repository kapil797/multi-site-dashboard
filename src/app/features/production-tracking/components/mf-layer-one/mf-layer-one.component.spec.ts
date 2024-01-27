import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfLayerOneComponent } from './mf-layer-one.component';

describe('MfLayerOneComponent', () => {
  let component: MfLayerOneComponent;
  let fixture: ComponentFixture<MfLayerOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfLayerOneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MfLayerOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
