import { Component, Input, OnInit } from '@angular/core';
import productionTrackingJson from '../../../../../assets/mock-data/production-tracking/production-tracking-2.json';

interface productionTrackingData {
  salesOrderNumber: {};
  factory: {};
  expectedCompleted: {};
  status: {};
}

@Component({
  selector: 'app-production-tracking2',
  templateUrl: './production-tracking2.component.html',
  styleUrl: './production-tracking2.component.scss'
})
export class ProductionTracking2Component implements OnInit{

  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;

  public defaultFontColor = '#E4E9EF';

  public productionTrackingData: productionTrackingData[];

  ngOnInit(): void {

    this.productionTrackingData;

    this.loadProductionTrackingDataFromMock();
  }

  private loadProductionTrackingDataFromMock() {
    this.productionTrackingData = productionTrackingJson;
  }

  public setDefaultHeaderStyle() {

    let style = { 'background-color': '#002540', 
    'color': this.defaultFontColor,
    'border': '0',
    'border-bottom': '.3rem solid #E4E9EF',
    'font-size': '1.5rem'
  }
    
    return style;
  }

  public setDefaultColumnStyle() {
    let style = {
      'color': this.defaultFontColor,
      'font-size': '1.5rem',
      'text-align': 'left'
    }

    return style;
  }

  public setStatusHeaderStyle() {
    let style = { 'background-color': '#002540', 
    'color': this.defaultFontColor,
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
