import { HttpErrorResponse } from '@angular/common/http';

import { urlJoin } from '@core/utils/routing';

interface ErrorRes {
  message?: string;
  error?: string;
}

export class BaseApi {
  getMfSalesOrders: string;
  getMfWorkOrders: string;
  postMfExecutions: string;

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
  ORDERAPP = 'https://dev.mf.platform/orderapp/api';
  RPS = 'https://dev.mf.platform/tr-rps/api';
  RTD = 'http://172.20.115.150:55443/api';

  override getMfSalesOrders = urlJoin(this.ORDERAPP, 'sales-orders');
  override getMfWorkOrders = urlJoin(this.RPS, 'sales-orders');
  override postMfExecutions = urlJoin(this.RTD, 'workorder/get/wo/process/execution/list');

  constructor() {
    super();
  }
}

export class ProdApi extends BaseApi {
  ORDERAPP = 'https://prod.mf.platform/orderapp/api';
  RPS = 'https://prod.mf.platform/tr-rps/api';
  RTD = 'http://172.20.115.150:55443/api';

  override getMfSalesOrders = urlJoin(this.ORDERAPP, 'sales-orders');
  override getMfWorkOrders = urlJoin(this.RPS, 'workorder');
  override postMfExecutions = urlJoin(this.RTD, 'workorder/get/wo/process/execution/list');

  constructor() {
    super();
  }
}
