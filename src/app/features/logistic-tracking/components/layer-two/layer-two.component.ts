import { Component } from '@angular/core';
import { Delivery } from '@lt/logistic-tracking-model';

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent {
  delivery: Delivery[];
  onDriverInfoEmit(event: Delivery[]) {
    this.delivery = event;
  }
}
