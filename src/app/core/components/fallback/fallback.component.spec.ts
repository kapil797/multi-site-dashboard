import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallbackComponent } from './fallback.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('FallbackComponent', () => {
  let component: FallbackComponent;
  let fixture: ComponentFixture<FallbackComponent>;
  let fallback: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FallbackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FallbackComponent);
    component = fixture.componentInstance;
    fallback = fixture.debugElement.query(By.css('#fallback'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 404 and error message', () => {
    expect(fallback.nativeElement.innerHTML).toContain('404');
    expect(fallback.nativeElement.innerHTML).toContain('The resource you have requested is not found');
  });
});
