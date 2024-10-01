import { NgModule } from '@angular/core';
import { LayerResolverComponent } from '@fav/components/layer-resolver/layer-resolver.component';
import { LayerOneComponent } from '@fav/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@fav/components/layer-two/layer-two.component';
import { SharedModule } from '@shared/shared.module';
import { MultiSiteComponent } from './multi-site/multi-site.component';
import { FeatureService } from '@core/services/feature.service';
import { FavouritesService } from './favourites-service';
import { FavouritesRoutingModule } from '@fav/favourites-routing.module';

@NgModule({
  declarations: [LayerResolverComponent, LayerOneComponent, LayerTwoComponent, MultiSiteComponent],
  imports: [FavouritesRoutingModule, SharedModule],
  providers: [FavouritesService, FeatureService],
})
export class FavouritesModule {}
