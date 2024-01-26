import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

import { BaseApi } from '@core/constants/api.constant';
import { Config } from '@core/constants/config.constant';
import { Factory } from '@core/models/factory.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public config: Config;
  public api: BaseApi;
  public appDialog: string | null = null;
  public factory$ = new BehaviorSubject<Factory>('MF');

  constructor() {}

  public init(config: Config, api: BaseApi) {
    this.config = config;
    this.api = api;
    return of(true);
  }

  public resetDialog() {
    this.appDialog = null;
  }
}
