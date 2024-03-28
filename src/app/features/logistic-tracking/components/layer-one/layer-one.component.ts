import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '@core/services/app.service';
import { LayerOneRouter } from '@core/classes/layer-one-router/layer-one-router.class';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayerOneComponent extends LayerOneRouter {
  constructor(
    protected override route: Router,
    protected override zone: NgZone,
    protected override app: AppService
  ) {
    super(route, zone, app);
  }
}
