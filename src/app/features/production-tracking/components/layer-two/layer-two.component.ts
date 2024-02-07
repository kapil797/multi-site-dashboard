import { Component, OnInit } from '@angular/core';
import { concatMap, from, map, switchMap, takeUntil, throwError, toArray } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@shared/classes/cancel-subscription/cancel-subscription.class';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { createNotif } from '@shared/configs/notification';
import { LineItem, Product, SalesOrder, WorkOrder } from '@pt/production-tracking.model';
import { Factory } from '@core/models/factory.model';
import { SalesOrderDetails } from '../sales-order-details/sales-order-details.component';
import { Dropdown } from '@shared/classes/form/form.class';

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public salesOrderIds: Dropdown[];
  public salesOrderDetails?: SalesOrderDetails;
  public workOrderDetails?: Product[];
  public factory: Factory;
  private salesOrderMap: Map<string, SalesOrder> = new Map();

  constructor(
    private app: AppService,
    private pt: ProductionTrackingService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.app.factory$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(res => {
          this.factory = res;
          return this.pt.fetchSalesOrders$(res);
        }),
        switchMap(res => {
          if (res.length === 0) return throwError(() => new Error('There are no SaleOrders to be retrieved'));

          // Update SalesOrderMap.
          res.forEach(row => this.salesOrderMap.set(row.salesOrderNumber, row));
          this.salesOrderIds = res.map(row => {
            return {
              text: row.salesOrderNumber,
              value: row.salesOrderNumber,
            };
          });

          // Fetch aggregate for first SalesOrder.
          return this.constructSalesOrderAggregate$(res[0].salesOrderNumber);
        })
      )
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.salesOrderDetails = res;
        },
        error: (error: string) => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
        complete: () => {
          console.log('hello');
        },
      });
  }

  private constructSalesOrderAggregate$(salesOrderId: string) {
    /*
      Each time a SalesOrder is changed, will need to fetch all related
      WorkOrders and Executions.

      This is because getting the projected completion and calculating 
      the status of SalesOrder requires the details of all Executions.
    */
    const salesOrder = this.salesOrderMap.get(salesOrderId);
    let releasedQty = 0;
    let completedQty = 0;
    let completedTime: number;
    let estimatedCompleteTime: number;
    if (!salesOrder) {
      return throwError(() => `SalesOrder ${salesOrderId} is invalid`);
    }
    return this.pt.fetchWorkOrders$(this.factory, [salesOrderId]).pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap(res => {
        const products = salesOrder.lineItems.map(row => {
          return this.constructProductAggregate$.bind(this, row, res);
        });
        return from(products);
      }),
      concatMap(f => {
        return f();
      }),
      toArray(),
      map(res => {
        // Side effect.
        this.workOrderDetails = res;

        res.forEach(product => {
          product.executions.forEach(row => {
            // Side effect mapping.
            row.partsCompleted = `${row.completeQty} of ${row.releasedQty}`;

            // Update status.
            releasedQty += row.releasedQty;
            completedQty += row.completeQty;

            // Update completedTime if any.
            if (!completedTime && row.processEndTime) {
              completedTime = new Date(row.processEndTime).getTime();
            } else if (completedTime && row.processEndTime) {
              completedTime = Math.max(completedTime, new Date(row.processEndTime).getTime());
            }

            // Updated estCompleteTime.
            if (!estimatedCompleteTime) {
              estimatedCompleteTime = new Date(row.estimateCompleteTime).getTime();
            } else {
              estimatedCompleteTime = Math.max(
                new Date(estimatedCompleteTime).getTime(),
                new Date(row.estimateCompleteTime).getTime()
              );
            }
          });
        });

        return {
          ...salesOrder,
          progress: Math.round((completedQty / releasedQty) * 100),
          estimateCompleteTime: new Date(estimatedCompleteTime).toISOString(),
          completedTime: completedQty === releasedQty ? new Date(completedTime).toISOString() : null,
        } as SalesOrderDetails;
      })
    );
  }

  private constructProductAggregate$(item: LineItem, workOrders: WorkOrder[]) {
    // Sacrifice optimization for simplicity.
    // Each product is required to loop through list of WorkOrders.
    const product: Product = {
      name: item.productName,
      id: item.productId,
      number: item.productNo,
      workOrders: [],
      executions: [],
    };

    const workOrderIds: string[] = [];
    workOrders.forEach(row => {
      if (row.productId === item.productId) {
        product.workOrders.push(row);
        workOrderIds.push(row.workOrderNumber);
      }
    });

    return this.pt.fetchExecutions$(this.factory, workOrderIds).pipe(
      map(res => {
        product.executions.push(...res);
        return product;
      })
    );
  }

  public onChangeSalesOrder(event: unknown) {
    this.isLoading = true;
    this.constructSalesOrderAggregate$(event as string).subscribe({
      next: res => {
        this.isLoading = false;
        this.salesOrderDetails = res;
      },
      error: error => {
        this.isLoading = false;
        this.salesOrderDetails = undefined;
        this.workOrderDetails = undefined;
        this.notif.show(createNotif('error', error));
      },
    });
  }
}
