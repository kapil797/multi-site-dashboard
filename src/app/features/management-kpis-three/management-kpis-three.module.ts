import { NgModule } from '@angular/core';
import { LayerResolverComponent } from '@mk3/components/layer-resolver/layer-resolver.component';
import { LayerOneComponent } from '@mk3/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@mk3/components/layer-two/layer-two.component';
import { SharedModule } from '@shared/shared.module';
import { KpiDetailComponent } from './components/kpi-detail/kpi-detail.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { FeatureService } from '@core/services/feature.service';

import { ManagementKpisThreeRoutingModule } from '@mk3/management-kpis-three-routing.module';
import { ManagementKpisThreeService } from '@mk3/management-kpis-three-service';
@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    KpiDetailComponent,
    PieChartComponent,
    MultiSiteComponent,
  ],
  imports: [ManagementKpisThreeRoutingModule, SharedModule],
  providers: [ManagementKpisThreeService, FeatureService],
})
export class ManagementKpisThreeModule {}
