import { Component, OnInit } from '@angular/core';
import { Dropdown } from '@core/classes/form/form.class';
import { AppService } from '@core/services/app.service';
import { ApiResponse, InventoryKPI } from '@mk/management-kpis-model';
import { ManagementKpisService } from '@mk/management-kpis-service';
import { LegendLabelsContentArgs } from '@progress/kendo-angular-charts';
import { IntlService } from '@progress/kendo-angular-intl';
import { firstValueFrom } from 'rxjs';
export interface DataItem {
  category: string;
  value: number;
}
@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent implements OnInit {
  frequency = 'Monthly';
  projectedData: DataItem[] = [];
  pieData: DataItem[] = [];
  displayCurrentNoValueMessage = false;
  displayProjectedNoValueMessage = false;
  selectedKPI = 1;
  inventoryPeriod = 1;
  labelColor: string = 'rgb(255,255,255)';
  constructor(
    private app: AppService,
    private intl: IntlService,
    private mk: ManagementKpisService
  ) {
    this.labelContent = this.labelContent.bind(this);
    // this.labelColor = this.labelColor.bind(this);
  }

  ngOnInit() {
    this.onKPIChange(1);
  }

  public labelContent(args: LegendLabelsContentArgs): string {
    return `${args.dataItem.category.toUpperCase()} (SGD)\nTOTAL: ${this.intl.formatNumber(args.dataItem.value, 'p2')}`;
  }
  getApiCallBasedOnKPI(kpi: number, transMonth: number) {
    switch (kpi) {
      case 1:
        return this.mk.fetchFinancialKPI$(this.app.factory(), this.frequency);
      case 2:
        return this.mk.fetchInventoryKPI$(this.app.factory(), transMonth);
      case 3:
        return this.mk.fetchOperationKPI$(this.app.factory(), this.frequency);
      case 4:
        return this.mk.fetchProductivityKPI$(this.app.factory(), this.frequency);
      case 5:
        return this.mk.fetchCustomerSatisfaction$(this.app.factory(), this.frequency);
      case 6:
        return this.mk.fetchSafetyKPI$(this.app.factory(), this.frequency);
      default:
        return this.mk.fetchFinancialKPI$(this.app.factory(), this.frequency);
    }
  }
  async onKPIChange(kpi: number) {
    this.selectedKPI = kpi || 1;
    // Set 'transMonth' based on 'frequency' in a more concise way
    const transMonth = ['Weekly', 'Monthly'].includes(this.frequency) ? 1 : 3;
    this.inventoryPeriod = transMonth;

    const apiCall = this.getApiCallBasedOnKPI(kpi, transMonth);
    const res: ApiResponse = await firstValueFrom(apiCall);
    let data;
    if (Array.isArray(res) || res.data) {
      data = res.data;
      if (res.data) {
        data = res['data'];
      } else {
        data = res as object[];
      }
    } else if (res.Result) {
      data = res.Result as InventoryKPI[];
      data.forEach(item => {
        let multiplier = 1;

        if (item.Category == 'Packaging') {
          multiplier = this.inventoryPeriod ? 1.2 : 1.2;
        } else if (item.Category == 'Membrane') {
          multiplier = this.inventoryPeriod ? 1.14 : 1.19;
        } else if (item.Category == 'PCB') {
          multiplier = this.inventoryPeriod ? 1.09 : 1.18;
        } else if (item.Category == 'Cartridge') {
          multiplier = this.inventoryPeriod ? 1.25 : 1.16;
        } else if (item.Category == 'Resin') {
          multiplier = this.inventoryPeriod ? 1.08 : 1.07;
        } else {
          multiplier = this.inventoryPeriod ? 1.06 : 1.12;
        }

        item['value'] = (item['Cost'] * multiplier).toFixed(2);
      });
    }

    this.displayCurrentNoValueMessage = false;
    this.displayProjectedNoValueMessage = false;

    this.pieData = [];
    this.projectedData = [];
    if (!data) {
      return;
    }
    let currentKey: string;
    let projectKey: string;
    if (kpi != 2) {
      currentKey = 'Value';
      projectKey = 'Projection';
    } else {
      currentKey = 'value';
      projectKey = 'Cost';
    }

    const currentTotal = this.sumUpValue(data, currentKey);
    const projectedTotal = this.sumUpValue(data, projectKey);

    data.forEach(item => {
      let currentDataItem = parseFloat(item[currentKey]) ? item[currentKey] : 0;
      let projectDataItem = parseFloat(item[projectKey]) ? item[projectKey] : 0;

      currentDataItem = isNaN(currentDataItem) ? 0 : currentDataItem;
      projectDataItem = isNaN(projectDataItem) ? 0 : projectDataItem;

      this.pieData.push({ category: item['Category'], value: currentDataItem / currentTotal });
      this.projectedData.push({ category: item['Category'], value: projectDataItem / projectedTotal });
    });

    if (kpi === 6) {
      if (currentTotal === 0) {
        this.pieData = [{ category: 'No. of days without incident', value: 1 }];
      }

      if (projectedTotal === 0) {
        this.projectedData = [{ category: 'No. of days without incident', value: 1 }];
      }
    } else {
      if (currentTotal === 0) {
        this.displayCurrentNoValueMessage = true;
      }

      if (projectedTotal === 0) {
        this.displayProjectedNoValueMessage = true;
      }
    }
  }

  public period: Dropdown[] = ['WEEKLY', 'MONTHLY', 'QUARTERLY'].map(row => {
    return {
      text: row,
      value: row,
    };
  });
  public projection: Dropdown[] = ['30 DAYS'].map(row => {
    return {
      text: row,
      value: row,
    };
  });

  public onTogglePeriod(event: unknown) {
    this.frequency = event as string;
    this.onKPIChange(this.selectedKPI);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onToggleProjection(event: unknown) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sumUpValue(array: any[], key: string): number {
    return array.reduce((acc, curr) => acc + parseFloat(curr[key] || 0), 0);
  }
}
