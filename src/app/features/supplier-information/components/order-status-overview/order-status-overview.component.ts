import { Component, OnInit } from '@angular/core';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { AppService } from '@core/services/app.service';
import { OrderStatusSummary } from '@lt/logistic-tracking-model';
import { LogisticTrackingService } from '@lt/logistic-tracking-service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-status-overview',
  templateUrl: './order-status-overview.component.html',
  styleUrl: './order-status-overview.component.scss',
})
export class OrderStatusOverviewComponent extends CancelSubscription implements OnInit {
  seriesColors = ['#21D794', '#fa5c5c'];
  BACKGROUND: '#002135';
  orderStatusCategory: string[];
  orderStatusData: number[][];
  constructor(
    private app: AppService,
    private lt: LogisticTrackingService
  ) {
    super();
  }
  ngOnInit() {
    this.lt
      .fetchOrderStatusSummary$(this.app.factory())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res: OrderStatusSummary[]) => {
        this.orderStatusCategory = res.map(item => item.OrderStatus.replace(' ', '\n'));
        const ontime = res.map(item => item.OnTimeFrequency);
        const late = res.map(item => item.LateFrequency);
        this.orderStatusData = [ontime, late]; // this.orderStatusData should be an array of number arrays
      });
  }
}
