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

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    KpiDetailComponent,
    PieChartComponent,
    MulitSiteComponent,
  ],
  imports: [ManagementKpisRoutingModule, SharedModule],
  providers: [ManagementKpisService],
})
export class ManagementKpisModule {}
