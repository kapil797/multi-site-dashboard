import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemChangedEvent } from '@progress/kendo-angular-scrollview';
import { Product } from '@pt/production-tracking.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  @Input() products: Product[];
  @Output() toggleProduct = new EventEmitter<string>();
  @Output() toggleProcess = new EventEmitter<string>();
  public activeProductIndex = 0;
  public activeProcessIndex = 0;
  public String = String;

  constructor() {}

  public get processes() {
    return this.products[this.activeProductIndex]?.processes || [];
  }

  public onChangeProduct(event: ItemChangedEvent) {
    const item = event.item as Product;
    this.toggleProduct.emit(item.name);

    // Updating the product will also change the process.
    // To auto-select the first process.
    this.activeProcessIndex = 0;
    this.onChangeProcess({ index: 0, item: item.processes[0] });
  }

  public onChangeProcess(event: ItemChangedEvent) {
    const item = event.item as string;
    this.toggleProcess.emit(item);
  }
}
