import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemChangedEvent } from '@progress/kendo-angular-scrollview';
import { Product } from '@pt/production-tracking.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  @Input() products: Product[];
  @Output() toggleProduct = new EventEmitter<string>();
  @Output() toggleProcess = new EventEmitter<string>();
  public processes: string[];
  public String = String;

  constructor() {}

  ngOnInit(): void {
    if (this.products.length > 0) this.processes = this.products[0].processes;
  }

  public onChangeProduct(event: ItemChangedEvent) {
    const item = event.item as Product;
    this.processes = item.processes;
    this.toggleProduct.emit(item.name);
  }

  public onChangeProcess(event: ItemChangedEvent) {
    const item = event.item as string;
    this.toggleProcess.emit(item);
  }
}
