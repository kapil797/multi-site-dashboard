import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Factory } from '@core/models/factory.model';
import { MachineStatus } from '@rt/resource-tracking.model';

@Component({
  selector: 'app-factory-layout-plan',
  templateUrl: './factory-layout-plan.component.html',
  styleUrl: './factory-layout-plan.component.scss',
})
export class FactoryLayoutPlanComponent {
  @Input() factory: Factory;
  @Input() data: MachineStatus[];
  @Output() machine = new EventEmitter<MachineStatus>();
  public mfLevelOne = 'assets/images/factories/mf-level-one.png';
  public mfLevelTwo = 'assets/images/factories/mf-level-two.png';
  public umfLevelOne = 'assets/images/factories/umf-level-one.png';

  constructor() {}

  public resolveMachineBgColor(item: MachineStatus) {
    if (item.power === 0) return 'neutral';
    else if (item.power === 1) return 'success';
    return 'error';
  }

  public resolveMachineStyle(item: MachineStatus) {
    return {
      left: `${item.x}%`,
      top: `${item.y}%`,
    };
  }

  public onSelectMachine(event: MachineStatus) {
    this.machine.emit(event);
  }
}
