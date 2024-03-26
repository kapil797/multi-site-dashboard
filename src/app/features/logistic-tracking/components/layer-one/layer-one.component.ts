import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  WsFactoryDisplayStream,
  consumerStreams,
  filterStreamFromWebsocketGateway$,
} from '@core/models/websocket.model';
import { changeFactoryInUrl } from '@core/utils/formatters';
import { AppService } from '@core/services/app.service';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayerOneComponent implements OnInit {
  constructor(
    private route: Router,
    private zone: NgZone,
    private app: AppService
  ) {}

  ngOnInit(): void {
    filterStreamFromWebsocketGateway$(this.app.wsGateway$, consumerStreams.FACTORY_DISPLAY).subscribe(res => {
      const msg = res.data as WsFactoryDisplayStream;
      this.zone.run(() => {
        this.route.navigate(changeFactoryInUrl(this.route, msg.factory), {
          queryParams: this.route.routerState.snapshot.root.children[0].queryParams,
          queryParamsHandling: 'merge',
        });
      });
    });
  }
}
