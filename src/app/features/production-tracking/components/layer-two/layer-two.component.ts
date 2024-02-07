import { Component, OnInit } from '@angular/core';
import { concatMap, from, map, switchMap, takeUntil, throwError, toArray } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@shared/classes/cancel-subscription/cancel-subscription.class';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { createNotif } from '@shared/configs/notification';
import { Execution, LineItem, Product, SalesOrder, WorkOrder } from '@pt/production-tracking.model';
import { Factory } from '@core/models/factory.model';
import { SalesOrderDetails } from '../sales-order-details/sales-order-details.component';
import { Dropdown } from '@shared/classes/form/form.class';

interface StatusMetadata {
  releasedQty: number;
  completedQty: number;
  endTime?: string;
  estimatedCompleteTime?: string;
}

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
      });
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

  private constructSalesOrderAggregate$(salesOrderId: string) {
    /*
      Each time a SalesOrder is changed, will need to fetch all related
      WorkOrders and Executions. This is because getting the projected 
      completion and calculating the status of SalesOrder requires 
      the details of all Executions.
    */
    const salesOrder = this.salesOrderMap.get(salesOrderId);
    if (!salesOrder) {
      return throwError(() => `SalesOrder ${salesOrderId} is invalid`);
    }
    return this.pt.fetchWorkOrders$(this.factory, [salesOrderId]).pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap(res => {
        // Aggregate the WorkOrders to each lineItem, and fetch all related Executions.
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
        this.workOrderDetails = res;

        // To get the status of a SalesOrder, need to sum the releasedQty
        // and completedQty for all related executions, regardless of lineItems.
        const status: StatusMetadata = {
          releasedQty: 0,
          completedQty: 0,
        };
        res.forEach(product => {
          product.executions.forEach(row => {
            this.aggregateStatusOfExecutions(row, status);

            // Side effect mapping.
            row.partsCompleted = `${row.completeQty} of ${row.releasedQty}`;
          });
        });

        return {
          ...salesOrder,
          progress: Math.round((status.completedQty / status.releasedQty) * 100),
          estimatedCompleteTime: status.estimatedCompleteTime ? status.estimatedCompleteTime : null,
          completedTime: status.endTime && status.completedQty === status.releasedQty ? status.endTime : null,
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

  private aggregateStatusOfExecutions(row: Execution, status: StatusMetadata) {
    // Update quantities.
    status.releasedQty += row.releasedQty;
    status.completedQty += row.completeQty;

    // Update endTime if any; take the latest value.
    if (!status.endTime && row.processEndTime) {
      status.endTime = row.processEndTime;
    } else if (status.endTime && row.processEndTime) {
      const latest = Math.max(new Date(status.endTime).getTime(), new Date(row.processEndTime).getTime());
      status.endTime = new Date(latest).toISOString();
    }

    // Updated estCompleteTime if any; take the latest value.
    if (!status.estimatedCompleteTime) {
      status.estimatedCompleteTime = row.estimateCompleteTime;
    } else {
      const latest = Math.max(
        new Date(status.estimatedCompleteTime).getTime(),
        new Date(row.estimateCompleteTime).getTime()
      );
      status.estimatedCompleteTime = new Date(latest).toISOString();
    }
  }
}
