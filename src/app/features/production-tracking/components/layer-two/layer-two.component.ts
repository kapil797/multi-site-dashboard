import { Component, OnInit } from '@angular/core';
import { CancelSubscription } from '@shared/classes/cancel-subscription.class';

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent extends CancelSubscription implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log('hello');
  }
}
