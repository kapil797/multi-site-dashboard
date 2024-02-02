import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ItemChangedEvent } from '@progress/kendo-angular-scrollview';

export interface ScrollItem {
  name: string;
  id: string | number;
  [key: string]: unknown;
}

@Component({
  selector: 'app-custom-scroll',
  templateUrl: './custom-scroll.component.html',
  styleUrl: './custom-scroll.component.scss',
})
export class CustomScrollComponent implements OnChanges {
  @Input() header: string;
  @Input() data?: ScrollItem[];
  @Input() icon: IconDefinition;
  @Output() toggle = new EventEmitter<ScrollItem>();
  public activeIndex = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.activeIndex = 0;
    }
  }

  public onChange(_event: ItemChangedEvent) {
    if (this.data) {
      this.toggle.emit(this.data[this.activeIndex]);
    }
  }

  public getMarginOffset(event: HTMLDivElement) {
    return { marginTop: `${event.clientHeight / 2 - 30}px` };
  }
}
