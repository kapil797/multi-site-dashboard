import { Component, OnInit } from '@angular/core';
import { switchMap, take, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { ResourceTrackingService } from '@rt/resource-tracking.service';
import { MachineStatus } from '@rt/resource-tracking.model';

interface MachineData {
  title: string;
  data: MachineStatus[];
}

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public machinesData: MachineData[] = [];
  public machinesStatus: MachineStatus[];
  public factory: string;

  constructor(
    private app: AppService,
    private rt: ResourceTrackingService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.app.factory$
      .pipe(
        take(1),
        switchMap(res => {
          this.factory = res;
          return this.rt.fetchMachinesStatus$(res);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: res => {
          this.isLoading = false;

          // For layout plan.
          this.machinesStatus = res;

          // For displaying tables.
          const hashmap = this.groupMachinesByCategory(res);
          // Output machine data by order.
          const catOrder = ['MTS', 'MTO', 'SES'];
          for (const k of catOrder) {
            const temp = hashmap.get(k);
            if (!temp || temp.length === 0) continue;
            this.machinesData.push({
              title: this.constructTitleFromCategory(k),
              data: temp,
            });
          }
        },
        error: error => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error));
        },
      });
  }

  private groupMachinesByCategory(res: MachineStatus[]) {
    const hashmap = new Map<string, MachineStatus[]>();
    res.forEach(row => {
      if (!hashmap.has(row.category)) {
        hashmap.set(row.category, [row]);
      } else {
        const temp = hashmap.get(row.category);
        temp?.push(row);
      }
    });
    hashmap.forEach((v, _k, _m) => {
      v.sort((a, b) => a.id.localeCompare(b.id));
    });
    return hashmap;
  }

  private constructTitleFromCategory(category: string) {
    if (category === 'MTS') return 'Make to stock (MTS) machines';
    else if (category === 'MTO') return 'Make to order (MTO) machines';
    else if (category === 'SES') return 'Smart engineering system (SES)';
    return 'Undefined title';
  }
}
