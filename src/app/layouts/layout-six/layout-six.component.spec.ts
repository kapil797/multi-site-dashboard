import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSixComponent } from './layout-six.component';

describe('LayoutSixComponent', () => {
  let component: LayoutSixComponent;
  let fixture: ComponentFixture<LayoutSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutSixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
