import { HttpErrorResponse } from '@angular/common/http';
import { Factory } from '@core/models/factory.model';
import { urlJoin } from '@core/utils/routing';
import { Config } from '@core/constants/config.constant';

interface ErrorRes {
  message?: string;
  error?: string;
}

export class BaseApi {
  // To override.
  public MF_RPS_URL: string;
  public MF_RTD_URL: string;
  public MF_ORDERAPP_URL: string;
  public MF_DASHBOARD_API_URL: string;
  public MF_DASHBOARD_MIDDLEWARE_URL: string;

  public UMF_RPS_URL: string;
  public UMF_RTD_URL: string;
  public UMF_ORDERAPP_URL: string;
  public UMF_DASHBOARD_API_URL: string;
  public UMF_DASHBOARD_MIDDLEWARE_URL: string;

  // Independent of factories.
  public MAP_API_URL: string;
  public MAP_ACCESS_TOKEN: string;
  public ROUTE_API_URL: string;
  public MACHINE_DATA_API: string;

  // Define API endpoints here.
  // Override in different environments if necessary,
  // else it should be the same for all environments.
  public ORDERAPP_SALES_ORDER = 'salesorders';
  public RPS_SALES_ORDER = 'salesorder/api/salesorder';
  public RPS_WORK_ORDER = 'workorder/api/workorder';
  public RTD_WORK_ORDER = 'workorder/get/wo/list';
  public RTD_EXECUTION = 'workorder/get/wo/process/execution/list';
  public DASHBOARD_API_BROADCAST = 'api/v1/broadcast';

  constructor(config: Config) {
    this.init(config);
  }

  // For APIs that are dependent on factory, to concatenate them at runtime instead.
  public concatRpsApiByFactory(factory: string, ...apiSuffixes: string[]) {
    switch (factory) {
      case Factory.MODEL_FACTORY:
        return urlJoin(this.MF_RPS_URL, ...apiSuffixes);
      case Factory.MICRO_FACTORY:
        return urlJoin(this.MF_RPS_URL, ...apiSuffixes);
      default:
        return '';
    }
  }

  public concatRtdApiByFactory(factory: string, ...apiSuffixes: string[]) {
    switch (factory) {
      case Factory.MODEL_FACTORY:
        return urlJoin(this.MF_RTD_URL, ...apiSuffixes);
      case Factory.MICRO_FACTORY:
        return urlJoin(this.MF_RTD_URL, ...apiSuffixes);
      default:
        return '';
    }
  }

  public concatOrderappApiByFactory(factory: string, ...apiSuffixes: string[]) {
    switch (factory) {
      case Factory.MODEL_FACTORY:
        return urlJoin(this.MF_ORDERAPP_URL, ...apiSuffixes);
      case Factory.MICRO_FACTORY:
        return urlJoin(this.MF_ORDERAPP_URL, ...apiSuffixes);
      default:
        return '';
    }
  }

  public concatMiddleWareApiByFactory(factory: string, ...apiSuffixes: string[]) {
    switch (factory) {
      case Factory.MODEL_FACTORY:
        return urlJoin(this.MF_DASHBOARD_MIDDLEWARE_URL, ...apiSuffixes);
      case Factory.MICRO_FACTORY:
        return urlJoin(this.MF_DASHBOARD_MIDDLEWARE_URL, ...apiSuffixes);
      default:
        return '';
    }
  }

  public concatDashboardApiSvcApiByFactory(factory: string, ...apiSuffixes: string[]) {
    switch (factory) {
      case Factory.MODEL_FACTORY:
        return urlJoin(this.MF_DASHBOARD_API_URL, ...apiSuffixes);
      case Factory.MICRO_FACTORY:
        return urlJoin(this.MF_DASHBOARD_API_URL, ...apiSuffixes);
      default:
        return '';
    }
  }

  public init(config: Config) {
    this.MF_RPS_URL = config.MF_RPS_URL;
    this.MF_RTD_URL = config.MF_RTD_URL;
    this.MF_ORDERAPP_URL = config.MF_ORDERAPP_URL;
    this.MF_DASHBOARD_API_URL = config.MF_DASHBOARD_API_URL;
    this.MF_DASHBOARD_MIDDLEWARE_URL = config.MF_DASHBOARD_MIDDLEWARE_URL;
    this.MAP_API_URL = config.MAP_API_URL;
    this.MAP_ACCESS_TOKEN = config.MAP_ACCESS_TOKEN;
    this.ROUTE_API_URL = config.ROUTE_API_URL;
    this.MACHINE_DATA_API = config.MACHINE_DATA_API;

    // TODO: to add UMF URLs later.
  }

  public mapHttpError(res: string | HttpErrorResponse | ErrorRes | Error): string {
    /*
      Handler for all kinds of HTTPErrorResponse i.e. string, object, etc.
      For catch and rethrow strategy, use throwError(() => new Error(msg)) in catchError() handler.
    */
    let msg = 'An unknown error has occurred while making a request';

    if (typeof res === 'string') {
      msg = res;
    } else if (res instanceof HttpErrorResponse) {
      if (typeof res.error === 'string') {
        msg = res.error;
      } else if (typeof res.error.message === 'string') {
        msg = res.error.message;
      } else if (typeof res.error.error === 'string') {
        msg = res.error.error;
      }
    } else if (res instanceof Error) {
      msg = res.message;
    } else {
      if (res.message) {
        msg = res.message;
      } else if (res.error) {
        msg = res.error;
      }
    }
    return msg;
  }
}

export class DevApi extends BaseApi {
  constructor(config: Config) {
    super(config);
  }
}

export class ProdApi extends BaseApi {
  constructor(config: Config) {
    super(config);
  }
}
