import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SupplierInformationModule } from './supplier-information.module';
import { AppService } from '@core/services/app.service';
import { IndividualOrderStatus, MapToken, OrderStatusSummary, TrackingPostalCode } from './supplier-information-model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: SupplierInformationModule,
})
export class SupplierInformationService {
  constructor(
    private http: HttpClient,
    private app: AppService
  ) {}

  public fetchToken$(factory: string) {
    const suffix = 'vehicle/token';
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get<MapToken>(api);
  }

  public fetchTrackingVehicles$(factory: string, mapToken: string) {
    const suffix = 'vehicle/list';
    const token = mapToken;
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.post(api, { token });
  }

  public fetchLogisticTrackingPostalCode$(factory: string, postal: string): Observable<TrackingPostalCode[]> {
    const suffix = `/vehicle/address?postal=${postal}`;
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get(api).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((response: any) => {
        return response as TrackingPostalCode[];
      })
    );
  }

  // public fetchLogisticTrackingEndPostalCode$(_postal: string) {
  //   const data: EndPostalCode[] = EndPostal;
  //   return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  // }

  // public fetchLogisticTrackingJobs$() {
  //   const data: DeliveryDetail[] = logisticTrackingJobs;
  //   return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  // }

  public fetchOrderStatusSummary$(factory: string) {
    const suffix = '/nexus?topic=GetOrderStatusSummary';
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get<OrderStatusSummary[]>(api);
  }

  public fetchIndividualOrderStatus$(factory: string) {
    const suffix = '/nexus?topic=GetIndividualOrderStatus';
    const api = this.app.api.concatMiddleWareApiByFactory(factory, suffix);
    return this.http.get<IndividualOrderStatus[]>(api);
  }
}
