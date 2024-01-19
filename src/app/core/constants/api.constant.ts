import { HttpErrorResponse } from '@angular/common/http';

import { urlJoin } from '@core/utils/routing';

interface ErrorRes {
  message?: string;
  error?: string;
}

export class BaseApi {
  getItems: string;

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
  RPS = 'https://dev.mf.platform/tr-rps/product';

  override getItems = urlJoin(this.RPS, '/api/item');

  constructor() {
    super();
  }
}

export class ProdApi extends BaseApi {
  RPS = 'https://prod.mf.platform/tr-rps/product';

  override getItems = urlJoin(this.RPS, '/api/item');

  constructor() {
    super();
  }
}
