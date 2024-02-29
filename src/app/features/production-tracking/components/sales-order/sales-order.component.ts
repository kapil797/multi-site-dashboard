import { Component, Input } from '@angular/core';
import { faBars, faHashtag, faTriangleExclamation, faUser } from '@fortawesome/free-solid-svg-icons';
import { SalesOrderAggregate } from '@pt/production-tracking.model';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.scss',
})
export class SalesOrderComponent {
  @Input() data?: SalesOrderAggregate;
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
