import { Component, OnInit } from '@angular/core';
import { Dialogs } from '@core/constants/dialogs.constant';
import { AppService } from '@core/services/app.service';

@Component({
  selector: 'app-multi-site',
  templateUrl: './multi-site.component.html',
  styleUrl: './multi-site.component.scss',
})
export class MultiSiteComponent implements OnInit {
  showDialog: boolean = false;
  selectedProduct: string = '';
  selectedTimePeriod: string = 'Day';
  public title: string = 'Favourites';
  constructor(private app: AppService) {}
  gridTemplate = [
    { name: 'Option 1', id: 'grid-1' },
    { name: 'Option 2', id: 'grid-2' },
  ];
  selectedTemplate = this.gridTemplate[0];

  availablePerformanceIndicators = [
    { name: 'Production Tracking', id: 'performanceIndicator-1' },
    { name: 'Resource Tracking', id: 'performanceIndicator-2' },
    { name: 'Resource Health', id: 'performanceIndicator-3' },
  ];
  selectedPerformanceIndicator = this.availablePerformanceIndicators[1];

  availableFactories = [
    { name: 'ModelFactory@CT2B', id: 'machine-1' },
    { name: 'Unknown', id: 'machine-2' },
  ];
  selectedFactory = this.availableFactories[0];

  availableMachines = [
    { name: 'Oven 1', id: 'machine-1' },
    { name: 'Oven 2', id: 'machine-2' },
    { name: 'Oven 3', id: 'machine-3' },
  ];
  selectedMachine = this.availableMachines[1];

  ngOnInit() {
    this.selectedTemplate = this.gridTemplate[0];
    this.selectedPerformanceIndicator = this.availablePerformanceIndicators[1];
    this.selectedFactory = this.availableFactories[0];
    this.selectedMachine = this.availableMachines[1];
    this.selectedTimePeriod = 'Day';
    console.log('Selected template on init:', this.selectedTemplate);
    console.log('Selected performance indicator on init:', this.selectedPerformanceIndicator);
    console.log('Selected factory on init:', this.selectedFactory);
    console.log('Selected machine on init:', this.selectedMachine);
  }

  onSelectGridTemplate() {
    console.log('Grid template selected!');
  }

  onClick() {
    console.log('Here we go!');
    this.showDialog = true;
  }

  onSubmit() {
    console.log('Submitted!', {
      performanceIndicator: this.selectedPerformanceIndicator,
      factory: this.selectedFactory,
      product: this.selectedProduct,
      machine: this.selectedMachine,
      timePeriod: this.selectedTimePeriod,
    });
    this.showDialog = false;
    this.resetForm();
  }

  onCancel() {
    console.log('Cancelled!');
    this.showDialog = false;
    this.resetForm();
  }

  private resetForm() {
    this.selectedPerformanceIndicator = this.availablePerformanceIndicators[1];
    this.selectedFactory = this.availableFactories[0];
    this.selectedProduct = '';
    this.selectedMachine = this.availableMachines[1];
    this.selectedTimePeriod = 'Day';
  }
  public onOpenNavMenu() {
    this.app.appDialog = Dialogs.NAV_MENU;
  }
}
