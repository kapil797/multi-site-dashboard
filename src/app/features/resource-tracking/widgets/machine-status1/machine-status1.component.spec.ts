import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineStatus1Component } from './machine-status1.component';

describe('MachineStatus1Component', () => {
  let component: MachineStatus1Component;
  let fixture: ComponentFixture<MachineStatus1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineStatus1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineStatus1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
