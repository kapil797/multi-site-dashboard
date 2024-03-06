import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';

import { FallbackComponent } from '@core/components/fallback/fallback.component';
import { RoutePaths } from '@core/constants/routes.constant';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { LayerOneComponent } from '@pi/components/layer-one/layer-one.component';
import { LayerTwoComponent } from '@pi/components/layer-two/layer-two.component';

@Component({
  selector: 'app-layer-resolver',
  templateUrl: './layer-resolver.component.html',
  styleUrl: './layer-resolver.component.scss',
})
export class LayerResolverComponent extends CancelSubscription implements OnInit {
  public Component: Type<unknown>;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      const layer = res.get(RoutePaths.LAYER) as string;
      switch (layer) {
        case RoutePaths.LAYER_ONE:
          this.Component = LayerOneComponent;
          return;
        case RoutePaths.LAYER_TWO:
          this.Component = LayerTwoComponent;
          return;
      }
      this.Component = FallbackComponent;
    });
  }
}
