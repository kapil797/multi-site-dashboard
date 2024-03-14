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
  @Input() content?: string;
  @Input() status?: boolean;
  constructor() {}

  public formatContent(v?: string) {
    // CSS text ellipsis must be constrained by width.
    // To use custom formatter instead, but won't be responsive.
    if (!v) return 'Not Available';
    if (v.length > 30) return v.substring(0, 30) + '...';
    return v;
  }
}
