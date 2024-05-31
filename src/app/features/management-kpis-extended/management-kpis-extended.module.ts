import { NgModule } from '@angular/core';
import { LayerResolverComponent } from '@mkext/components/layer-resolver/layer-resolver.component';
import { LayerOneComponent } from '@mkext/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@mkext/components/layer-two/layer-two.component';
import { ManagementKpisExtendedRoutingModule } from '@mkext/management-kpis-extended-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ManagementKpisExtendedService } from './management-kpis-extended-service';
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
  imports: [ManagementKpisExtendedRoutingModule, SharedModule],
  providers: [ManagementKpisExtendedService],
})
export class ManagementKpisExtendedModule {}
