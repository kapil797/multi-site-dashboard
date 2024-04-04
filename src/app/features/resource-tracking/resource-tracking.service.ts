import { Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';

import { AppService } from '@core/services/app.service';
import { Factory } from '@core/models/factory.model';
import { ResourceConsumption, MachineStatus, MachineAlertHistory } from '@rt/resource-tracking.model';
import machineStatusMf from '@rt/mock-data/machine-status-mf.json';
import machineStatusUmf from '@rt/mock-data/machine-status-umf.json';
import { getRandomInt, getRandomNumber } from '@core/utils/formatters';

@Injectable({
  providedIn: 'any',
})
export class ResourceTrackingService {
  constructor(private app: AppService) {}

  public fetchMachinesStatus$(factory: string) {
    let data: MachineStatus[] = [];
    switch (factory) {
      case Factory.MODEL_FACTORY:
        data = machineStatusMf;
        break;
      case Factory.MICRO_FACTORY:
        data = machineStatusUmf;
        break;
    }
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchMachineResourceConsumption$(_factory: string, _machine: MachineStatus) {
    // Generate a random set of 20 items.
    // Interval of 3 secs.
    const today = new Date();
    const lastMaintained = new Date().setDate(today.getDate() - 14);
    const earliest = lastMaintained - 20 * 3 * 1000;
    const data: ResourceConsumption[] = [];
    for (let i = 0; i < 20; i++) {
      const temp: ResourceConsumption = {
        receivedDate: new Date(earliest + i * 3 * 1000).toISOString(),
        sequence: i,
        powerLoad: getRandomNumber(0, 2.5),
        windowedMode: 3,
      };
      data.push(temp);
    }
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }

  public fetchMachineAlertHistory$(_factory: string, _machine: MachineStatus) {
    const data: MachineAlertHistory[] = [];
    const today = Date.now();
    const description = ['Stop', 'Auto', 'Initialize', 'Disconnected'];
    for (let i = 0; i < 5; i++) {
      const temp: MachineAlertHistory = {
        issue: 'Machine Status',
        createdDate: new Date(today - getRandomInt(0, 3 * 24 * 60 * 60 * 1000)).toISOString(),
        description: description.at(getRandomInt(0, description.length - 1)) as string,
      };
      data.push(temp);
    }

    data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    return of(data).pipe(catchError(err => throwError(() => new Error(this.app.api.mapHttpError(err)))));
  }
}
