import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutThreeComponent } from './layout-three.component';

describe('LayoutThreeComponent', () => {
  let component: LayoutThreeComponent;
  let fixture: ComponentFixture<LayoutThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutThreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
