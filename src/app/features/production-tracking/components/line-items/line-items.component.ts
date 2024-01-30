import { Component, Input } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export interface LineItem {
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-line-items',
  templateUrl: './line-items.component.html',
  styleUrl: './line-items.component.scss',
})
export class LineItemsComponent {
  @Input() data: LineItem[];
  public faBars = faBars;
}
