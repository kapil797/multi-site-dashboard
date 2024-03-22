import { Component, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { changeFactoryInUrl } from '@core/utils/formatters';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayerOneComponent implements OnInit, OnDestroy {
  private bc = new BroadcastChannel('factoryChannel');

  constructor(
    private route: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.bc.onmessage = event => {
      this.zone.run(() => {
        this.route.navigate(changeFactoryInUrl(this.route, event.data), {
          queryParams: this.route.routerState.snapshot.root.children[0].queryParams,
          queryParamsHandling: 'merge',
        });
      });
    };
  }

  ngOnDestroy(): void {
    this.bc.close();
  }
}
