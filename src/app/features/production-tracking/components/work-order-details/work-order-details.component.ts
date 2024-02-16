import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faGear, faGift, faHashtag, faPuzzlePiece, faRobot } from '@fortawesome/free-solid-svg-icons';

import { Execution, ProcessTracking, Product } from '@pt/production-tracking.model';
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
  public scrollProducts?: ScrollItem[];
  public curProduct?: Product;
  public curProcess?: Execution;
  public processTracking?: ProcessTracking;

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
    } else {
      this.curProduct = undefined;
      this.curProcess = undefined;
      this.processTracking = undefined;
      this.scrollProducts = undefined;
    }
  }

  public onToggleProduct(event: ScrollItem) {
    if (!this.data) return;
    const product = this.data.find(v => v.id === event.id);
    if (!product) return;
    this.curProduct = product;

    // Fetch processTrackingMap.
    this.pt.fetchProcessTrackingTemplateMap$(this.factory, product.id).subscribe({
      next: res => {
        if (!res) {
          this.processTracking = this.pt.constructDynamicProcessTrackingMap(product);
        } else {
          this.processTracking = this.pt.constructProcessTrackingMapFromTemplate(product, res);
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
    else this.curProcess = undefined;
  }
}
