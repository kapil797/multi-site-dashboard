import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogisticTrackingModule } from './logistic-tracking.module';
import { AppService } from '@core/services/app.service';
import {
  DeliveryDetail,
  EndPostalCode,
  IndividualOrderStatus,
  MapToken,
  OrderStatusSummary,
  TrackingPostalCode,
} from './logistic-tracking-model';
import EndPostal from '@lt/mock-data/endpostal.json';
import logisticTrackingJobs from '@lt/mock-data/logistic-tracking-jobs.json';
import { Observable, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: LogisticTrackingModule,
})
export class LogisticTrackingService {
  constructor(
    private http: HttpClient,
    private app: AppService
  ) {}
  public fetchToken() {
    const suffix = 'vehicle/token';
    const api = this.app.api.concatMiddleWareApiWithSuffixes(suffix);
    return this.http.get<MapToken>(api);
  }
  public fetchTrackingVehicles(mapToken: string) {
    const suffix = 'vehicle/list';
    const token = mapToken;
    const api = this.app.api.concatMiddleWareApiWithSuffixes(suffix);
    return this.http.post(api, { token });
  }
  public fetchLogisticTrackingPostalCode(postal: string): Observable<TrackingPostalCode[]> {
    const suffix = `/vehicle/address?postal=${postal}`;
    const api = this.app.api.concatMiddleWareApiWithSuffixes(suffix);
    return this.http.get(api).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((response: any) => {
        return response as TrackingPostalCode[];
      })
    );
  }
  public fetchLogisticTrackingEndPostalCode(_postal: string) {
    const data: EndPostalCode[] = EndPostal;
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }
  public fetchLogisticTrackingJobs() {
    const data: DeliveryDetail[] = logisticTrackingJobs;
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }
  public fetchOrderStatusSummary() {
    const suffix = '/nexus?topic=GetOrderStatusSummary';
    const api = this.app.api.concatMiddleWareApiWithSuffixes(suffix);
    return this.http.get<OrderStatusSummary[]>(api);
  }
  public fetchIndividualOrderStatus() {
    const suffix = '/nexus?topic=GetIndividualOrderStatus';
    const api = this.app.api.concatMiddleWareApiWithSuffixes(suffix);
    return this.http.get<IndividualOrderStatus[]>(api);
  }
}
