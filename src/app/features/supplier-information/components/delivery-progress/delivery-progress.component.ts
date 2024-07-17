import { Component, Input } from '@angular/core';
import { Delivery } from '@lt/logistic-tracking-model';

@Component({
  selector: 'app-delivery-progress',
  templateUrl: './delivery-progress.component.html',
  styleUrl: './delivery-progress.component.scss',
})
export class DeliveryProgressComponent {
  @Input() delivery: Delivery[];
  constructor() {}
  //ngOnInit() {}
}
