import { NgModule } from '@angular/core';
import { LayerResolverComponent } from '@mk2/components/layer-resolver/layer-resolver.component';
import { LayerOneComponent } from '@mk2/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@mk2/components/layer-two/layer-two.component';

import { SharedModule } from '@shared/shared.module';
import { KpiDetailComponent } from './components/kpi-detail/kpi-detail.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { FeatureService } from '@core/services/feature.service';

import { ManagementKpisTwoRoutingModule } from '@mk2/management-kpis-routing.module';
import { ManagementKpisTwoService } from '@mk2/management-kpis-two-service';

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    KpiDetailComponent,
    PieChartComponent,
    MultiSiteComponent,
  ],
  imports: [ManagementKpisTwoRoutingModule, SharedModule],
  providers: [ManagementKpisTwoService, FeatureService],
})
export class ManagementKpisTwoModule {}
