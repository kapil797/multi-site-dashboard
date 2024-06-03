import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-global-shopfloor-status1',
  templateUrl: './global-shopfloor-status1.component.html',
  styleUrl: './global-shopfloor-status1.component.scss',
})
export class GlobalShopfloorStatus1Component {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;
}
