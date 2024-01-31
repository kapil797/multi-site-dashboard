import { Component, Input, OnInit } from '@angular/core';
import { faGear, faGift, faHashtag, faPuzzlePiece, faRobot } from '@fortawesome/free-solid-svg-icons';

import { Execution, Product } from '@pt/production-tracking.model';
import { ScrollItem } from '@pt/components/custom-scroll/custom-scroll.component';

@Component({
  selector: 'app-work-order-details',
  templateUrl: './work-order-details.component.html',
  styleUrl: './work-order-details.component.scss',
})
export class WorkOrderDetailsComponent implements OnInit {
  @Input() data: Product[];
  public products: ScrollItem[];
  public faGear = faGear;
  public faGift = faGift;
  public faRobot = faRobot;
  public faHashtag = faHashtag;
  public faPuzzlePiece = faPuzzlePiece;
  public curProcess?: Execution;

  constructor() {}

  public get partCompletionStatus() {
    if (!this.curProcess) return 'Not Available';
    return `${this.curProcess?.completeQty} of ${this.curProcess?.releasedQty}`;
  }

  ngOnInit(): void {
    this.products = this.data.map(row => {
      return {
        text: row.name,
        id: row.id,
      };
    });

    // Select first process if any.
    if (this.data.length > 0 && this.data[0].processes.length > 0) {
      this.curProcess = this.data[0].processes[0];
    }
  }

  public onToggleProduct(event: ScrollItem) {
    console.log(event);
  }

  public onToggleProcess(event: string) {
    console.log(event);
  }
}
