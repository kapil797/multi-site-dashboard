import { Component, Input } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { SalesOrderLine } from '@pt/production-tracking.model';

@Component({
  selector: 'app-line-items',
  templateUrl: './line-items.component.html',
  styleUrl: './line-items.component.scss',
})
export class LineItemsComponent {
  @Input() data?: SalesOrderLine[];
  public faBars = faBars;
}
