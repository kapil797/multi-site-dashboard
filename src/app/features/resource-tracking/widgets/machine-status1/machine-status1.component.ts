import { Component, Input } from '@angular/core';
import { faPowerOff, faBolt, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-machine-status1',
  templateUrl: './machine-status1.component.html',
  styleUrl: './machine-status1.component.scss',
})
export class MachineStatus1Component {
  @Input() title: string;
  @Input() subtitle: string;
  public powerOffIcon: IconDefinition = faPowerOff;
  public boltIcon: IconDefinition = faBolt;
  public trashIcon: IconDefinition = faTrashCan;
  public productionCapacity: number = 92;
  public seriesData = [
    { month: 'Jan', value: 90 },
    { month: 'Feb', value: 92 },
    { month: 'Mar', value: 93 },
    { month: 'Apr', value: 91 },
    { month: 'May', value: 92 },
  ];

  public categories: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  public average: number = 92;
  public greenZoneData = [
    { month: 'Jan', min: 91, max: 93 },
    { month: 'Feb', min: 91, max: 93 },
    { month: 'Mar', min: 91, max: 93 },
    { month: 'Apr', min: 91, max: 93 },
    { month: 'May', min: 91, max: 93 },
  ];
}
