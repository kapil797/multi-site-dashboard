import { NgModule } from '@angular/core';
import { LayerResolverComponent } from '@mk1/components/layer-resolver/layer-resolver.component';
import { LayerOneComponent } from '@ci/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@ci/components/layer-two/layer-two.component';
import { SharedModule } from '@shared/shared.module';
import { CriticalIssuesService } from './critical-issues-service';
import { KpiDetailComponent } from './components/kpi-detail/kpi-detail.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { FeatureService } from '@core/services/feature.service';
import { CriticalIssuesRoutingModule } from '@ci/critical-issues-routing.module';

@NgModule({
  declarations: [
    LayerResolverComponent,
    LayerOneComponent,
    LayerTwoComponent,
    KpiDetailComponent,
    PieChartComponent,
    MultiSiteComponent,
  ],
  imports: [CriticalIssuesRoutingModule, SharedModule],
  providers: [CriticalIssuesService, FeatureService],
})
export class CriticalIssuesModule {}
