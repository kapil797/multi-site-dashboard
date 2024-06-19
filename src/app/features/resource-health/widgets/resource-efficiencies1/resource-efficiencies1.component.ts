import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-resource-efficiencies1',
  templateUrl: './resource-efficiencies1.component.html',
  styleUrl: './resource-efficiencies1.component.scss'
})
export class ResourceEfficiencies1Component {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;

  public data = {

    "energyEfficiencies": {
      "value": "22.55%",
      "color": "#E95459"
    },
    "resourceEfficiencies": {
      "value": "81%",
      "color": "#60EA80"
    }    
  };
}
