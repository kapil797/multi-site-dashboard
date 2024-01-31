import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProductionTrackingRoutingModule } from '@pt/production-tracking-routing.module';
import { ProductionTrackingService } from '@pt/production-tracking.service';
import { NavigationComponent } from '@pt/components/navigation/navigation.component';
import { CustomCardComponent } from '@pt/components/custom-card/custom-card.component';
import { ProjectedCompletionComponent } from '@pt/components/projected-completion/projected-completion.component';
import { ProgressComponent } from '@pt/components/progress/progress.component';
import { SalesOrderDetailsComponent } from '@pt/components/sales-order-details/sales-order-details.component';
import { LineItemsComponent } from '@pt/components/line-items/line-items.component';
import { LayerOneComponent } from '@pt/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@pt/components/layer-two/layer-two.component';
import { CustomScrollComponent } from '@pt/components/custom-scroll/custom-scroll.component';
import { WorkOrderDetailsComponent } from '@pt/components/work-order-details/work-order-details.component';
import { ProcessTrackingComponent } from '@pt/components/process-tracking/process-tracking.component';

@NgModule({
  declarations: [
    LayerOneComponent,
    LayerTwoComponent,
    NavigationComponent,
    CustomCardComponent,
    ProjectedCompletionComponent,
    ProgressComponent,
    SalesOrderDetailsComponent,
    LineItemsComponent,
    CustomScrollComponent,
    WorkOrderDetailsComponent,
    ProcessTrackingComponent,
  ],
  imports: [ProductionTrackingRoutingModule, SharedModule],
  providers: [ProductionTrackingService],
})
export class ProductionTrackingModule {}
