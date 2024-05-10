import { NgModule } from '@angular/core';
import { LayerOneComponent } from '@lt/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@lt/components/layer-two/layer-two.component';
import { LayerResolverComponent } from '@lt/components/layer-resolver/layer-resolver.component';
import { TrackingMapComponent } from '@lt/components/tracking-map/tracking-map.component';
import { LogisticTrackingRoutingModule } from '@lt/logistic-tracking-routing.module';
import { SharedModule } from '@shared/shared.module';
import { LogisticTrackingService } from './logistic-tracking-service';
import { DeliveryProgressComponent } from '@lt/components/delivery-progress/delivery-progress.component';
import { OrderStatusOverviewComponent } from '@lt/components/order-status-overview/order-status-overview.component';
import { OrderStatusIndividualComponent } from './components/order-status-individual/order-status-individual.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { FeatureService } from '@core/services/feature.service';
import { OrderStatusComponent } from './widgets/order-status/order-status.component';

@NgModule({
  declarations: [
    LayerOneComponent,
    LayerTwoComponent,
    LayerResolverComponent,
    TrackingMapComponent,
    DeliveryProgressComponent,
    OrderStatusOverviewComponent,
    OrderStatusIndividualComponent,
    MultiSiteComponent,
    OrderStatusComponent,
  ],
  imports: [LogisticTrackingRoutingModule, SharedModule],
  providers: [LogisticTrackingService, FeatureService],
})
export class LogisticTrackingModule {}
