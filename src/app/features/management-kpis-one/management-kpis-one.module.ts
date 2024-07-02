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
import { ManagementKPI1Component } from '@mk1/widgets/management-kpi1/management-kpi1.component';
import { ManagementKPI2Component } from '@mk1/widgets/management-kpi2/management-kpi2.component';
import { ManagementKPI3Component } from '@mk1/widgets/management-kpi3/management-kpi3.component';

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    KpiDetailComponent,
    PieChartComponent,
    MultiSiteComponent,
    ManagementKPI1Component,
    ManagementKPI2Component,
    ManagementKPI3Component,
  ],
  imports: [ManagementKpisOneRoutingModule, SharedModule],
  providers: [ManagementKpisOneService, FeatureService],
})
export class ManagementKpisOneModule {}
