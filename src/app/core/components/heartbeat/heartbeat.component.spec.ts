import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartbeatComponent } from './heartbeat.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeartbeatComponent', () => {
  let component: HeartbeatComponent;
  let fixture: ComponentFixture<HeartbeatComponent>;
  let heartbeat: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartbeatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeartbeatComponent);
    component = fixture.componentInstance;
    heartbeat = fixture.debugElement.query(By.css('#heartbeat'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heartbeat message', () => {
    expect(heartbeat.nativeElement.innerHTML).toContain('Heartbeat is alive!');
  });
});
