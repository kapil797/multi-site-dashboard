import { Component, Input } from '@angular/core';
import { faBars, faHashtag, faTriangleExclamation, faUser } from '@fortawesome/free-solid-svg-icons';

import { SalesOrder } from '@pt/production-tracking.model';

export interface SalesOrderDetails extends SalesOrder {
  progress: number;
  estimatedCompleteTime: string | undefined;
  completedTime: string | undefined;
}

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.component.html',
  styleUrl: './sales-order-details.component.scss',
})
export class SalesOrderDetailsComponent {
  @Input() data?: SalesOrderDetails;
  public isLate = false;
  public faHashtag = faHashtag;
  public faUser = faUser;
  public faBars = faBars;
  public faTriangleExclamation = faTriangleExclamation;

  constructor() {}

  public onLate() {
    this.isLate = true;
  }
}
