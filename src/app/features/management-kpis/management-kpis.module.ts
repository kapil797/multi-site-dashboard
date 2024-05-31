import { NgModule } from '@angular/core';
import { LayerResolverComponent } from '@mk/components/layer-resolver/layer-resolver.component';
import { LayerOneComponent } from '@mk/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@mk/components/layer-two/layer-two.component';
import { ManagementKpisRoutingModule } from '@mk/management-kpis-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ManagementKpisService } from './management-kpis-service';
import { KpiDetailComponent } from './components/kpi-detail/kpi-detail.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { MulitSiteComponent } from './mulit-site/mulit-site.component';
import { FeatureService } from '@core/services/feature.service';
import { ManagementKPI1Component } from './widgets/management-kpi1/management-kpi1.component';
import { ManagementKPI2Component } from './widgets/management-kpi2/management-kpi2.component';
import { ManagementKPI3Component } from './widgets/management-kpi3/management-kpi3.component';

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    KpiDetailComponent,
    PieChartComponent,
    MulitSiteComponent,
    ManagementKPI1Component,
    ManagementKPI2Component,
    ManagementKPI3Component
  ],
  imports: [ManagementKpisRoutingModule, SharedModule],
  providers: [ManagementKpisService, FeatureService],
})
export class ManagementKpisModule {}
