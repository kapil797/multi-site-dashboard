import { Component } from '@angular/core';
import { progressColors } from '@shared/configs/progress-bars.config';

import { CardData } from '@pt/components/custom-card/custom-card.component';

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.component.html',
  styleUrl: './sales-order-details.component.scss',
})
export class SalesOrderDetailsComponent {
  public progressValue = 80;
  public progressColors = progressColors;
  public imgOrderList = 'assets/images/production-tracking/products.png';
  public salesOrderData: CardData = {
    header: 'sales order',
    srcImg: 'assets/images/production-tracking/hash.png',
    content: ['this is some very long text this is some very long text'],
  };
  public customerData: CardData = {
    header: 'customer',
    srcImg: 'assets/images/production-tracking/customer.png',
    content: ['Some customer'],
  };
  public orderData: CardData = {
    header: 'order list',
    srcImg: 'assets/images/production-tracking/products.png',
    content: ['12 X eScentz(MTS)', '12 X eScentz(MTS)'],
    fillSpace: true,
  };
  public dueDate = '2024-01-29T11:35:16.43';

  constructor() {}
}
