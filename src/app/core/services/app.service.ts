import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { BaseApi } from '@core/constants/api.constant';
import { Config } from '@core/constants/config.constant';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public config: Config;
  public api: BaseApi;
  public appDialog: string | null = null;

  constructor() {}

  public init(config: Config, api: BaseApi) {
    this.config = config;
    this.api = api;
    return of(true);
  }
}
