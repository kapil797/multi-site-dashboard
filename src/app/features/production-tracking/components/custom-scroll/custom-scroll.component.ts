import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface ScrollItem {
  text: string;
  id: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-custom-scroll',
  templateUrl: './custom-scroll.component.html',
  styleUrl: './custom-scroll.component.scss',
})
export class CustomScrollComponent {
  @Input() header: string;
  @Input() data: ScrollItem[];
  @Input() icon: IconDefinition;
  @Output() toggle = new EventEmitter<ScrollItem>();
  public activeIndex = 0;

  constructor() {}

  public onToggle(value: number) {
    this.activeIndex += value;
    this.toggle.emit(this.data[this.activeIndex]);
  }
}
