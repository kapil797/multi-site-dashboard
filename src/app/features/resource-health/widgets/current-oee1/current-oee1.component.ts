import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-current-oee1',
  templateUrl: './current-oee1.component.html',
  styleUrl: './current-oee1.component.scss'
})
export class CurrentOEE1Component {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;

  public data = {
    "value": "81%",
    "color": "#60EA80"
  };
}
