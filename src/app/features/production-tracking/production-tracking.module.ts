import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProductionTrackingRoutingModule } from '@pt/production-tracking-routing.module';

import { ProductionTrackingService } from '@pt/production-tracking.service';

import { CustomCardComponent } from '@pt/components/custom-card/custom-card.component';
import { ProjectedCompletionComponent } from '@pt/components/projected-completion/projected-completion.component';
import { ProgressComponent } from '@pt/components/progress/progress.component';
import { SalesOrderComponent } from '@pt/components/sales-order/sales-order.component';
import { LineItemsComponent } from '@pt/components/line-items/line-items.component';
import { LayerOneComponent } from '@pt/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@pt/components/layer-two/layer-two.component';
import { CustomScrollComponent } from '@pt/components/custom-scroll/custom-scroll.component';
import { WorkOrderComponent } from '@pt/components/work-order/work-order.component';
import { ProcessTrackingComponent } from '@pt/components/process-tracking/process-tracking.component';
import { LayerResolverComponent } from '@pt/components/layer-resolver/layer-resolver.component';
import { AlertComponent } from '@pt/components/alert/alert.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { ProductionTracking1Component } from './widgets/production-tracking1/production-tracking1.component';
import { ProductionTracking2Component } from './widgets/production-tracking2/production-tracking2.component';
import { FeatureService } from '@core/services/feature.service';

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    CustomCardComponent,
    ProjectedCompletionComponent,
    ProgressComponent,
    SalesOrderComponent,
    LineItemsComponent,
    CustomScrollComponent,
    WorkOrderComponent,
    ProcessTrackingComponent,
    AlertComponent,
    MultiSiteComponent,
    ProductionTracking1Component,
    ProductionTracking2Component
  ],
  imports: [ProductionTrackingRoutingModule, SharedModule],
  providers: [ProductionTrackingService, FeatureService],
})
export class ProductionTrackingModule {}
