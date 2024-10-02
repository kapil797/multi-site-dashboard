import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  private apiUrl = 'http://msd_backend:8000/api/v1/rt/machines/machine1';

  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMachineData(lookBackPeriod: string, timeBucket: string): Observable<any> {
    const params = {
      lookBackPeriod,
      timeBucket,
    };
    return this.http.get(this.apiUrl, { params });
  }
}
