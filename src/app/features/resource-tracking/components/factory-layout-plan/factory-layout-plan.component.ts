import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Factory } from '@core/models/factory.model';
import { AppService } from '@core/services/app.service';
import { MachineStatus } from '@rt/resource-tracking.model';

@Component({
  selector: 'app-factory-layout-plan',
  templateUrl: './factory-layout-plan.component.html',
  styleUrl: './factory-layout-plan.component.scss',
})
export class FactoryLayoutPlanComponent implements OnInit {
  @Input() data: MachineStatus[];
  @Output() machine = new EventEmitter<MachineStatus>();
  public mfLevelOne = 'assets/images/factories/mf-level-one.png';
  public mfLevelTwo = 'assets/images/factories/mf-level-two.png';
  public umfLevelOne = 'assets/images/factories/umf-level-one.png';
  public factory: string;
  public Factory = Factory;

  constructor(private app: AppService) {}

  ngOnInit(): void {
    this.factory = this.app.factory();
  }

  public resolveMachineBgColor(item: MachineStatus) {
    if (item.power === 0) return 'neutral';
    else if (item.power === 1) return 'success';
    return 'error';
  }

  public resolveMachineStyle(item: MachineStatus) {
    const relativeSize = this.applyRelativeSizing(item.x, item.y);
    return {
      left: `${relativeSize[0]}%`,
      top: `${relativeSize[1]}%`,
    };
  }

  public onSelectMachine(event: MachineStatus) {
    this.machine.emit(event);
  }

  private applyRelativeSizing(x: number, y: number) {
    // Current X/Y coordinates saved are relative to an initial size of factory image.
    // To change accordingly when image size changes.
    return [x + 2, y];
  }
}
