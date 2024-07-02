import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSiteComponent } from './multi-site.component';

describe('MulitSiteComponent', () => {
  let component: MultiSiteComponent;
  let fixture: ComponentFixture<MultiSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSiteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
