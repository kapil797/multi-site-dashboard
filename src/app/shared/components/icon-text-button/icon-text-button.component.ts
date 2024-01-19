import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { trimTextWithEllipsis } from '@core/utils/formatters';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface IconTextButton {
  context?: string[];
  navigationExtras?: NavigationExtras;
  title: string;
  icon: IconProp;
  toolTip?: string;
}

@Component({
  selector: 'app-icon-text-button',
  templateUrl: './icon-text-button.component.html',
  styleUrl: './icon-text-button.component.scss',
})
export class IconTextButtonComponent {
  @Input() metadata: IconTextButton;
  @Output() clickEvent = new EventEmitter<IconTextButton>();
  public trimTextWithEllipsis = trimTextWithEllipsis;

  constructor(private router: Router) {}

  public onClick() {
    if (this.metadata.context) {
      this.router.navigate(this.metadata.context, this.metadata.navigationExtras);
    } else {
      this.clickEvent.emit(this.metadata);
    }
  }
}
