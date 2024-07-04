import { NgModule } from '@angular/core';
import { LayerResolverComponent } from '@mk1/components/layer-resolver/layer-resolver.component';
import { LayerOneComponent } from '@mk1/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@mk1/components/layer-two/layer-two.component';
import { SharedModule } from '@shared/shared.module';
import { ManagementKpisOneService } from './management-kpis-one-service';
import { KpiDetailComponent } from './components/kpi-detail/kpi-detail.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { FeatureService } from '@core/services/feature.service';
import { ManagementKpisOneRoutingModule } from '@mk1/management-kpis-one-routing.module';
import { ManagementKPI1SmallComponent } from '@mk1/widgets/management-kpi1-small/management-kpi1-small.component';
import { ManagementKPI2SmallComponent } from '@mk1/widgets/management-kpi2-small/management-kpi2-small.component';
import { ManagementKPI3SmallComponent } from '@mk1/widgets/management-kpi3-small/management-kpi3-small.component';

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    KpiDetailComponent,
    PieChartComponent,
    MultiSiteComponent,
    ManagementKPI1SmallComponent,
    ManagementKPI2SmallComponent,
    ManagementKPI3SmallComponent,
  ],
  imports: [ManagementKpisOneRoutingModule, SharedModule],
  providers: [ManagementKpisOneService, FeatureService],
})
export class ManagementKpisOneModule {}
