import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inventory-performance1',
  templateUrl: './inventory-performance1.component.html',
  styleUrl: './inventory-performance1.component.scss'
})
export class InventoryPerformance1Component {

  @Input() title: string;
  @Input() subtitle: string;

  data = {
    "filterRate": {
      "value": "90.54%",
      "color": "#60EA80",
      "good": ">90%",
      "acceptable": "85-90%",
      "poor": "<85%"
    },
    "turnover": {
      "value": "4",
      "color": "#F9B959",
      "good": "5-10",
      "acceptable": "1-5 or 10-15",
      "poor": "<1 or >15"
    },
    "stockout": {
      "value": "2%",
      "color": "#60EA80",
      "good": "<5%",
      "acceptable": ">5% and <10%",
      "poor": ">10%"
    }
  }

}
