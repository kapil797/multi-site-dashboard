import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
// import { LogisticTrackingService } from './supplier-information-service';
import { FeatureService } from '@core/services/feature.service';
import { SupplierInformationService } from './supplier-information-service';
import { SupplierInformationRoutingModule } from './supplier-information-routing.module';
import { GlobalShopfloorStatus1Component } from './widgets/global-shopfloor-status1/global-shopfloor-status1.component';
import { Others1MediumComponent } from './widgets/others1-medium/others1-medium.component';

@NgModule({
  declarations: [GlobalShopfloorStatus1Component, Others1MediumComponent],
  imports: [SupplierInformationRoutingModule, SharedModule],
  providers: [SupplierInformationService, FeatureService],
})
export class SupplierInformationModule {}
