import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faGear, faGift, faHashtag, faPuzzlePiece, faRobot } from '@fortawesome/free-solid-svg-icons';

import { Execution, LineItemAggregate, SalesOrderAggregate } from '@pt/production-tracking.model';
import { ScrollItem } from '@pt/components/custom-scroll/custom-scroll.component';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrl: './work-order.component.scss',
})
export class WorkOrderComponent implements OnChanges {
  @Input() data?: SalesOrderAggregate;
  public faGear = faGear;
  public faGift = faGift;
  public faRobot = faRobot;
  public faHashtag = faHashtag;
  public faPuzzlePiece = faPuzzlePiece;
  public lineItems?: ScrollItem[];
  public curLineItemAggregate?: LineItemAggregate;
  public curProcess?: Execution;
  private curLineItem?: ScrollItem;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (
        this.data &&
        this.curLineItemAggregate &&
        this.data.salesOrderNumber === this.curLineItemAggregate.salesOrderNumber
      ) {
        // Update by RTD, don't need to reset display.
        this.onToggleLineItem(this.curLineItem as ScrollItem);
        return;
      }

      this.resetDisplay();
      if (!this.data || this.data.lineItemAggregates.length === 0) return;

      // Check if to select first item or current selection item.
      const item = this.data.lineItemAggregates.find(row => row.id === this.curLineItemAggregate?.id);
      if (item) {
        // Current LineItem displayed is refreshed.
        this.curLineItemAggregate = item;
      } else {
        // Select first item.
        this.curLineItemAggregate = this.data.lineItemAggregates[0];
      }
      this.lineItems = this.data.salesOrderLines.map(row => {
        return {
          id: row.id,
          name: row.productName,
        };
      });
      this.curLineItem = this.lineItems[0];
    }
  }

  private resetDisplay(isNewSalesOrder: boolean = true) {
    this.curLineItemAggregate = undefined;
    this.curProcess = undefined;
    if (isNewSalesOrder) this.lineItems = undefined;
    this.curLineItem = undefined;
  }

  public onToggleLineItem(event: ScrollItem) {
    this.resetDisplay(false);
    const item = this.data?.lineItemAggregates.find(v => v.id === event.id);
    if (!item) return;
    this.curLineItemAggregate = item;
    this.curLineItem = event;
  }

  public onToggleExecution(event: number) {
    // Event is the processId, not the executionId from the processTrackingMap.
    if (!this.curLineItemAggregate) return;
    let execution: Execution | undefined;
    for (const row of this.curLineItemAggregate.workOrderAggregates) {
      execution = row.executions.find(x => x.process.id === event);
      if (execution) {
        this.formatPartsCompleted(execution);
        this.curProcess = execution;
        return;
      }
    }
    this.curProcess = undefined;
  }

  private formatPartsCompleted(execution: Execution) {
    execution.partsCompleted = `${execution.completeQty} out of ${execution.releasedQty}`;
  }
}
