import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DemandProfileRoutingModule } from '@dp/demand-profile-routing.module';

import { DemandProfileService } from '@dp/demand-profile.service';

import { LayerOneComponent } from '@dp/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@dp/components/layer-two/layer-two.component';
import { LayerResolverComponent } from '@dp/components/layer-resolver/layer-resolver.component';
import { ProfileChartComponent } from '@dp/components/profile-chart/profile-chart.component';
import { AlertComponent } from '@dp/components/alert/alert.component';

@NgModule({
  declarations: [LayerOneComponent, LayerTwoComponent, LayerResolverComponent, ProfileChartComponent, AlertComponent],
  imports: [SharedModule, DemandProfileRoutingModule],
  providers: [DemandProfileService],
})
export class DemandProfileModule {}
