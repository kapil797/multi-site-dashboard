import { AppService } from '@core/services/app.service';
import { Config } from '@core/constants/config.constant';
import { BaseApi, DevApi, ProdApi } from '@core/constants/api.constant';
import { environment } from 'src/environments/environment';

export function initApp(appService: AppService) {
  const config = environment as Config;
  let api: BaseApi;

  if (config.ENVIRONMENT === 'PRODUCTION') {
    api = new ProdApi(config);
  } else {
    api = new DevApi(config);
  }

  return () => appService.init(config, api);
}
