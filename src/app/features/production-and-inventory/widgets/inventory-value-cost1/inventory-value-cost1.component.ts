import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inventory-value-cost1',
  templateUrl: './inventory-value-cost1.component.html',
  styleUrl: './inventory-value-cost1.component.scss'
})
export class InventoryValueCost1Component {

  @Input() title: string;
  @Input() subtitle: string;

  data = {
    "valueKPI": {
      "value": "86,209",
      "color": "#60EA80",
      "good": ">80k",
      "acceptable": "50-80k",
      "poor": "<50k"
    },
    "costKPI": {
      "value": "46,209",
      "color": "#F9B959",
      "good": "0-50k",
      "acceptable": "50-100k",
      "poor": ">100k"
    }
  }
}
