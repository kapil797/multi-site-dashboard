import { NgComponentOutlet } from '@angular/common';
import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';

import { FallbackComponent } from '@core/components/fallback/fallback.component';
import { RoutePaths } from '@core/constants/routes.constant';
import { Factory } from '@core/models/factory.model';
import { CancelSubscription } from '@shared/classes/cancell-subscription/cancel-subscription.class';
import { MfLayerOneComponent } from '@pt/components/mf-layer-one/mf-layer-one.component';
import { MfLayerTwoComponent } from '@pt/components/mf-layer-two/mf-layer-two.component';

@Component({
  selector: 'app-layer-resolver',
  templateUrl: './layer-resolver.component.html',
  styleUrl: './layer-resolver.component.scss',
  standalone: true,
  imports: [NgComponentOutlet],
})
export class LayerResolverComponent extends CancelSubscription implements OnInit {
  public Component: Type<unknown>;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      const factory = res.get('factory')?.toUpperCase() as Factory;
      const layer = res.get(RoutePaths.LAYER) as string;
      if (factory === 'MF') {
        switch (layer) {
          case RoutePaths.LAYER_ONE:
            this.Component = MfLayerOneComponent;
            return;
          case RoutePaths.LAYER_TWO:
            this.Component = MfLayerTwoComponent;
            return;
        }
      } else if (factory === 'UMF') {
        switch (layer) {
          case RoutePaths.LAYER_ONE:
            this.Component = FallbackComponent;
            return;
          case RoutePaths.LAYER_TWO:
            this.Component = FallbackComponent;
            return;
        }
      }
      this.Component = FallbackComponent;
    });
  }
}
