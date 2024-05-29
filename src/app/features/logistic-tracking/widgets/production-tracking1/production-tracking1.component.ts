import { Component, Input } from '@angular/core';
import { OnInit} from '@angular/core';
import { ColumnSetting, getWidth } from '@core/models/grid.model';
import productionTrackingJson from '../../../../../assets/mock-data/production-tracking/production-tracking-1.json';

interface productionTrackingData {
  salesOrderNumber: {};
  factory: {};
  customer: {};
  expectedCompleted: {};
  status: {};
}

@Component({
  selector: 'app-production-tracking1',
  templateUrl: './production-tracking1.component.html',
  styleUrl: './production-tracking1.component.scss'
})
export class ProductionTracking1Component implements OnInit{
  
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;

  public isLoading = true;

  public productionTrackingCols: ColumnSetting[] = [
    { title: 'SALES ORDER NO.', field: 'salesOrderNumber.value', width: 220 },
    { title: 'FACTORY', field: 'factory.value', width: 250},
    { title: 'CUSTOMER', field: 'customer.value', width: 250 },
    { title: 'EXPECTED COMPLETION', field: 'expectedCompleted.value', width: 250 },
    { title: 'STATUS', field: 'status.value', width: 250 },
  ];

  public productionTrackingData: productionTrackingData[];

  public getWidth = getWidth;

  ngOnInit(): void {

    this.productionTrackingData;

    this.loadProductionTrackingDataFromMock();
  }

  private loadProductionTrackingDataFromMock() {
    this.productionTrackingData = productionTrackingJson;
  }

  public setDefaultHeaderStyle() {

    let style = { 'background-color': '#002540', 
    'color': '#E4E9EF',
    'border': '0',
    'border-bottom': '.3rem solid #E4E9EF',
    'font-size': '1.5rem'
  }
    
    return style;
  }

  public setDefaultColumnStyle() {
    let style = {
      'color': '#E4E9EF',
      'font-size': '1.5rem',
      'text-align': 'left'
    }

    return style;
  }

  public setStatusHeaderStyle() {
    let style = { 'background-color': '#002540', 
    'color': '#E4E9EF',
    'border': '0',
    'border-bottom': '.3rem solid #E4E9EF',
    'font-size': '1.5rem',
    // 'justify-content': 'right'
  }
    return style;
  }

  public setStatusColumnStyle() {
    let style = {
      'font-size': '1.5rem',
      'text-align': 'right'
    }

    return style;
  }


}
