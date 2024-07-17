import { NgModule } from '@angular/core';
import { LayerResolverComponent } from '@mk4/components/layer-resolver/layer-resolver.component';
import { LayerOneComponent } from '@mk4/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@mk4/components/layer-two/layer-two.component';
import { SharedModule } from '@shared/shared.module';
import { KpiDetailComponent } from './components/kpi-detail/kpi-detail.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { FeatureService } from '@core/services/feature.service';

import { ManagementKpisFourRoutingModule } from '@mk4/management-kpis-four-routing.module';
import { ManagementKpisFourService } from '@mk4/management-kpis-four-service';

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    KpiDetailComponent,
    PieChartComponent,
    MultiSiteComponent,
  ],
  imports: [ManagementKpisFourRoutingModule, SharedModule],
  providers: [ManagementKpisFourService, FeatureService],
})
export class ManagementKpisFourModule {}
