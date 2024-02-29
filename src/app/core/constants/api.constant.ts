import { HttpErrorResponse } from '@angular/common/http';

import { Factory } from '@core/models/factory.model';
import { urlJoin } from '@core/utils/routing';

interface ErrorRes {
  message?: string;
  error?: string;
}

export class BaseApi {
  // To override.
  public RPS_MF_BASE_URL: string;
  public RTD_MF_BASE_URL: string;
  public ORDERAPP_MF_BASE_URL: string;

  public RPS_UMF_BASE_URL: string;
  public RTD_UMF_BASE_URL: string;
  public ORDERAPP_UMF_BASE_URL: string;

  // Override if necessary, else it should be the same for all environments.
  public ORDERAPP_SALES_ORDER = 'salesorders';
  public RPS_WORK_ORDER = 'workorder/api/workorder';
  public RTD_WORK_ORDER = 'workorder/get/wo/list';
  public RTD_EXECUTION = 'workorder/get/wo/process/execution/list';

  // For APIs that are dependent on factory, to concatenate them at runtime instead.
  public concatRpsApiByFactory(factory: string, apiSuffixes: string[]) {
    switch (factory) {
      case Factory.MODEL_FACTORY:
        return urlJoin(this.RPS_MF_BASE_URL, ...apiSuffixes);
      case Factory.MICRO_FACTORY:
        return urlJoin(this.RPS_UMF_BASE_URL, ...apiSuffixes);
      default:
        return '';
    }
  }

  public concatRtdApiByFactory(factory: string, apiSuffixes: string[]) {
    switch (factory) {
      case Factory.MODEL_FACTORY:
        return urlJoin(this.RTD_MF_BASE_URL, apiSuffixes);
      case Factory.MICRO_FACTORY:
        return urlJoin(this.RTD_UMF_BASE_URL, apiSuffixes);
      default:
        return '';
    }
  }

  public concatOrderappApiByFactory(factory: string, apiSuffixes: string[]) {
    switch (factory) {
      case Factory.MODEL_FACTORY:
        return urlJoin(this.ORDERAPP_MF_BASE_URL, apiSuffixes);
      case Factory.MICRO_FACTORY:
        return urlJoin(this.ORDERAPP_UMF_BASE_URL, apiSuffixes);
      default:
        return '';
    }
  }

  public initApis() {
    // For APIs that are independent of factory,
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
  override RPS_MF_BASE_URL = 'https://mf.platform/tr-rps';
  override RTD_MF_BASE_URL = 'https://dev.mf.platform/dashboard/rtd/api';
  override ORDERAPP_MF_BASE_URL = 'https://dev.mf.platform/orderapp/api';

  override RPS_UMF_BASE_URL = '';
  override RTD_UMF_BASE_URL = '';
  override ORDERAPP_UMF_BASE_URL = '';

  constructor() {
    super();
    this.initApis();
  }
}

export class ProdApi extends BaseApi {
  override RPS_MF_BASE_URL = 'https://mf.platform/tr-rps/api';
  override RTD_MF_BASE_URL = 'https://mf.platform/dashboard/rtd/api';
  override ORDERAPP_MF_BASE_URL = 'https://mf.platform/orderapp/api';

  override RPS_UMF_BASE_URL = '';
  override RTD_UMF_BASE_URL = '';
  override ORDERAPP_UMF_BASE_URL = '';

  constructor() {
    super();
    this.initApis();
  }
}
