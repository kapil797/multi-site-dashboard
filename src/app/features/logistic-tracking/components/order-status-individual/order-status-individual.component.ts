import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogisticTrackingService } from '@lt/logistic-tracking-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { IndividualOrderStatus } from '@lt/logistic-tracking-model';

@Component({
  selector: 'app-order-status-individual',
  templateUrl: './order-status-individual.component.html',
  styleUrls: ['./order-status-individual.component.scss'],
})
export class OrderStatusIndividualComponent implements OnInit, OnDestroy {
  filterType = 'Direct Sales';
  selectedKPI = 1;
  private destroy$ = new Subject<void>();
  individualOrder: IndividualOrderStatus[] = [];

  constructor(private ltService: LogisticTrackingService) {}

  ngOnInit(): void {
    this.fetchAndFilterOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSalesChange(kpi: number): void {
    this.selectedKPI = kpi;
    this.filterType = kpi === 1 ? 'Direct Sales' : 'Indirect Sales';
    this.fetchAndFilterOrders();
  }

  private fetchAndFilterOrders(): void {
    this.ltService
      .fetchIndividualOrderStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          if (Array.isArray(res)) {
            const filteredRes = res.filter(item => item.AccountType === this.filterType);
            const mappedRes = filteredRes.map(item => {
              const actual = DateTime.fromISO(item.ActualDeliveryTime);
              const plan = DateTime.fromISO(item.OrderDueDate);

              item.ActualDeliveryTime = actual.isValid
                ? actual.toFormat('dd/MM/yyyy HH:mm:ss')
                : item.ActualDeliveryTime;
              item.OrderDueDate = plan.isValid ? plan.toFormat('dd/MM/yyyy HH:mm:ss') : item.OrderDueDate;

              return item;
            });

            this.individualOrder = mappedRes;
          }
        },
        error: err => console.error('An error occurred:', err),
      });
  }
}
