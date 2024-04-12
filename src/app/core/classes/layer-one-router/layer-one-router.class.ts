import { Directive, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Factory } from '@core/models/factory.model';

import {
  WsFactoryDisplayStream,
  consumerStreams,
  filterStreamsFromWebsocketGateway$,
} from '@core/models/websocket.model';
import { AppService } from '@core/services/app.service';
import { generateLayerUrlFragments } from '@core/utils/formatters';
import { CancelSubscription } from '../cancel-subscription/cancel-subscription.class';

/*
    To send a message from one browser to another, you can use:
    - Broadcast channel (recommended) but requires same origin and same browser
    - Websocket 

    By default, when the factory is changed (mf ,umf), if broadcast is true, 
    it will route to the same url but with the factory changed in the resource
    i.e. /microfactory/management-kpis/layer-one, /modelfactory/management-kpis/layer-one

    If additional query parameters are specified, it will take precedence.

    Overlay refers to a blank black screen. Ensure that the rendered component contains the overlayComponent.

    Accepted query parameters:
    - broadcast (true)
    - mf (overlay, demand-profile, management-kpis, etc.)
    - umf (overlay, demand-profile, management-kpis, etc.)
*/

interface RoutingData {
  fragments: string[];
  queryParams: Params;
}

@Directive()
export abstract class LayerOneRouter extends CancelSubscription implements OnInit, OnDestroy {
  private broadcastChannel = new BroadcastChannel('dashboard');
  public isOverlay: boolean;

  constructor(
    protected route: Router,
    protected zone: NgZone,
    protected app: AppService
  ) {
    super();
  }

  ngOnInit(): void {
    this.broadcastChannel.onmessage = event => {
      this.zone.run(() => {
        const routingData = this.handleRouteWithQueryParams(event.data);
        this.route.navigate(routingData.fragments, {
          queryParams: routingData.queryParams,
          queryParamsHandling: 'merge',
        });
      });
    };

    filterStreamsFromWebsocketGateway$(this.app.wsGateway$, [consumerStreams.FACTORY_DISPLAY]).subscribe(res => {
      this.zone.run(() => {
        const msg = res.data as unknown as WsFactoryDisplayStream;
        const routingData = this.handleRouteWithQueryParams(msg.factory);
        this.route.navigate(routingData.fragments, {
          queryParams: routingData.queryParams,
          queryParamsHandling: 'merge',
        });
      });
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.broadcastChannel.close();
  }

  private handleRouteWithQueryParams(factory: string) {
    let fragments: string[] = generateLayerUrlFragments(this.route, factory);
    const queryParams = this.route.routerState.snapshot.root.children[0].queryParams;
    this.isOverlay = false;

    if (queryParams['mf'] && factory === Factory.MODEL_FACTORY) {
      if (queryParams['mf'] === 'overlay') {
        this.isOverlay = true;
      } else {
        this.isOverlay = false;
        fragments = generateLayerUrlFragments(this.route, factory, queryParams['mf']);
      }
    } else if (queryParams['umf'] && factory === Factory.MICRO_FACTORY) {
      if (queryParams['umf'] === 'overlay') {
        this.isOverlay = true;
      } else {
        this.isOverlay = false;
        fragments = generateLayerUrlFragments(this.route, factory, queryParams['umf']);
      }
    }
    return {
      fragments,
      queryParams,
    } as RoutingData;
  }
}
