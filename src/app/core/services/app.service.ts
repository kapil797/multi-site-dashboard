import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

import { BaseApi } from '@core/constants/api.constant';
import { Config } from '@core/constants/config.constant';
import { initWebsocketGateway$ } from '@core/models/websocket.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public config: Config;
  public api: BaseApi;
  public wsGateway$: WebSocketSubject<unknown>;
  public appDialog: string | null = null;
  private factorySignal = signal<string>('');
  readonly factory = this.factorySignal.asReadonly();

  constructor() {}

  public init(config: Config, api: BaseApi) {
    this.config = config;
    this.api = api;
    this.wsGateway$ = initWebsocketGateway$(config.MF_DASHBOARD_WEBSOCKET_URL);
    return of(true);
  }

  public resetDialog() {
    this.appDialog = null;
  }

  public setFactory(v: string) {
    this.factorySignal.set(v);
  }
}
