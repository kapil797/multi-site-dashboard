import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProductionTrackingRoutingModule } from '@pt/production-tracking-routing.module';
import { MfLayerOneComponent } from '@pt/components/mf-layer-one/mf-layer-one.component';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { MfLayerTwoComponent } from '@pt/components/mf-layer-two/mf-layer-two.component';
import { NavigationComponent } from '@pt/components/navigation/navigation.component';
import { SalesOrderDetailsComponent } from '@pt/components/sales-order-details/sales-order-details.component';
import { CustomCardComponent } from '@pt/components/custom-card/custom-card.component';
import { ProjectedCompletionComponent } from '@pt/components/projected-completion/projected-completion.component';

@NgModule({
  declarations: [
    MfLayerOneComponent,
    MfLayerTwoComponent,
    NavigationComponent,
    SalesOrderDetailsComponent,
    CustomCardComponent,
    ProjectedCompletionComponent,
  ],
  imports: [ProductionTrackingRoutingModule, SharedModule],
  providers: [ProductionTrackingService],
})
export class ProductionTrackingModule {}
