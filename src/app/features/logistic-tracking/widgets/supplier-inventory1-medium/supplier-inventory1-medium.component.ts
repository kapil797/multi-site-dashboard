import { Component, Input } from '@angular/core';

import { OnInit } from '@angular/core';

import supplierInventoryJson from '../../../../../assets/mock-data/supplier-inventory.json';
import { ThemeService } from '@core/services/theme-service.service';
import { Theme } from '@core/constants/theme.constant';

interface SupplierInventoryData {
  company: object;
  turnover: object;
  fillRate: object;
  stockout: object;
}

@Component({
  selector: 'app-supplier-inventory1-medium',
  templateUrl: './supplier-inventory1-medium.component.html',
  styleUrl: './supplier-inventory1-medium.component.scss',
})
export class SupplierInventory1MediumComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() tag: string;
  @Input() api!: string;

  public defaultFontColor = '#E4E9EF';

  public isLoading = true;

  public supplierInventoryData: SupplierInventoryData[];

  ngOnInit(): void {

    this.supplierInventoryData = [];

    this.loadSupplierInventoryDataFromMock();
  }

  private loadSupplierInventoryDataFromMock() {
    this.supplierInventoryData = supplierInventoryJson;

    // console.log(this.supplierInventoryData);
    // console.log(supplierInventoryJson);
  }

  public setDefaultHeaderStyle() {
    const style = {
      'background-color': '#002540',
      color: this.defaultFontColor,
      border: '0',
      'border-bottom': '.3rem solid #E4E9EF',
      'font-size': '1.5rem',
    };

    return style;
  }

  public setDefaultColumnStyle() {
    const style = {
      color: this.defaultFontColor,
      'font-size': '1.5rem',
      'text-align': 'left',
    };

    return style;
  }

  public setStatusHeaderStyle() {
    const style = {
      'background-color': '#002540',
      color: '#E4E9EF',
      border: '0',
      'border-bottom': '.3rem solid #E4E9EF',
      'font-size': '1.5rem',
      'justify-content': 'right',
    };
    return style;
  }

  public setStatusColumnStyle() {
    const style = {
      'font-size': '1.5rem',
      'text-align': 'right',
    };

    return style;
  }
}
