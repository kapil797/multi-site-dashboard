import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulitSiteComponent } from './mulit-site.component';

describe('MulitSiteComponent', () => {
  let component: MulitSiteComponent;
  let fixture: ComponentFixture<MulitSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MulitSiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MulitSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
