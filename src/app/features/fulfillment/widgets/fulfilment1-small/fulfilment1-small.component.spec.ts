import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fulfilment1SmallComponent } from './fulfilment1-small.component';

describe('Fulfilment1Component', () => {
  let component: Fulfilment1SmallComponent;
  let fixture: ComponentFixture<Fulfilment1SmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fulfilment1SmallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Fulfilment1SmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
