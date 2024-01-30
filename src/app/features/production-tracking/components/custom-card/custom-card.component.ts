import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-custom-card',
  templateUrl: './custom-card.component.html',
  styleUrl: './custom-card.component.scss',
})
export class CustomCardComponent {
  @Input() header: string;
  @Input() icon: IconDefinition;
  @Input() content: string;
  constructor() {}
}
