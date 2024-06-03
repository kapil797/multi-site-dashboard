import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LayerOneComponent } from '@ful/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@ful/components/layer-two/layer-two.component';
import { LayerResolverComponent } from '@ful/components/layer-resolver/layer-resolver.component';
import { ProfileChartComponent } from '@ful/components/profile-chart/profile-chart.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { FulfillmentRoutingModule } from './fulfillment-routing.module';
import { FulfillmentService } from './fulfillment.service';
import { AlertComponent } from '@ful/components/alert/alert.component';

@NgModule({
  declarations: [
    LayerOneComponent,
    LayerTwoComponent,
    LayerResolverComponent,
    ProfileChartComponent,
    AlertComponent,
    MultiSiteComponent,
  ],
  imports: [SharedModule, FulfillmentRoutingModule],
  providers: [FulfillmentService],
})
export class FulfillmentModule {}
