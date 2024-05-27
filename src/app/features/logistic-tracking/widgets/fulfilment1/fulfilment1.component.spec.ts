import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fulfilment1Component } from './fulfilment1.component';

describe('Fulfilment1Component', () => {
  let component: Fulfilment1Component;
  let fixture: ComponentFixture<Fulfilment1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fulfilment1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Fulfilment1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
