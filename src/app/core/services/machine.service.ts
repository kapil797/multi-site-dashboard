import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  constructor(
    private http: HttpClient,
    private app: AppService
  ) {}
  private apiUrl = this.app.config.MACHINE_DATA_API;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMachineData(lookBackPeriod: string, timeBucket: string): Observable<any> {
    const params = {
      lookBackPeriod,
      timeBucket,
    };
    return this.http.get(this.apiUrl, { params });
  }
}
