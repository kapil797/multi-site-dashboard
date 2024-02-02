import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faGear, faGift, faHashtag, faPuzzlePiece, faRobot } from '@fortawesome/free-solid-svg-icons';

import { Execution, ProcessTracking, ProcessTrackingItem, Product } from '@pt/production-tracking.model';
import { ScrollItem } from '@pt/components/custom-scroll/custom-scroll.component';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { Factory } from '@core/models/factory.model';
import { NotificationService } from '@progress/kendo-angular-notification';
import { createNotif } from '@shared/configs/notification';

@Component({
  selector: 'app-work-order-details',
  templateUrl: './work-order-details.component.html',
  styleUrl: './work-order-details.component.scss',
})
export class WorkOrderDetailsComponent implements OnChanges {
  @Input() data?: Product[];
  @Input() factory: Factory;
  public faGear = faGear;
  public faGift = faGift;
  public faRobot = faRobot;
  public faHashtag = faHashtag;
  public faPuzzlePiece = faPuzzlePiece;
  public scrollProducts: ScrollItem[];
  public curProduct?: Product;
  public curProcess?: Execution;
  public processTracking: ProcessTracking;

  constructor(
    private pt: ProductionTrackingService,
    private notif: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.resetAndConstructDisplay();
    }
  }

  private resetAndConstructDisplay() {
    // Select first product and process.
    if (this.data && this.data.length > 0) {
      this.curProduct = this.data[0];
      this.scrollProducts = this.data.map(row => {
        return {
          name: row.name,
          id: row.id,
        };
      });
      this.onToggleProduct({ name: this.data[0].name, id: this.data[0].id });
    }
  }

  private constructDynamicProcessTrackingMap(product: Product) {
    // For SES products.
    const items: ProcessTrackingItem[] = product.executions.map(row => {
      return {
        text: row.process.name,
        processId: row.process.id,
        statusId: row.statusId,
        row: 0,
        col: row.step - 1, // 0-indexed.
      };
    });
    return {
      productId: product.id,
      category: 'Smart Engineering Systems (SES)',
      rows: 1,
      cols: items.length,
      items,
    } as ProcessTracking;
  }

  private mapProcessTrackingMetadata(product: Product, data: ProcessTracking) {
    const processMap = new Map<number, Execution>();
    product.executions.forEach(row => processMap.set(row.process.id, row));
    data.items = data.items.map(row => {
      const process = processMap.get(row.processId);
      if (process) row.statusId = process.statusId;
      return row;
    });
    return data;
  }

  public onToggleProduct(event: ScrollItem) {
    if (!this.data) return;
    const product = this.data.find(v => v.id === event.id);
    if (!product) return;
    this.curProduct = product;

    // Fetch processTrackingMap.
    this.pt.fetchProcessTrackingMap$(this.factory, product.id).subscribe({
      next: res => {
        if (!res) {
          this.processTracking = this.constructDynamicProcessTrackingMap(product);
        } else {
          this.processTracking = this.mapProcessTrackingMetadata(product, res);
        }
      },
      error: error => {
        this.notif.show(createNotif('error', error));
      },
    });
  }

  public onToggleProcess(event: string | number) {
    const process = this.curProduct?.executions.find(row => row.process.id === event);
    if (process) this.curProcess = process;
  }
}
