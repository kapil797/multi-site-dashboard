import { Component, NgZone, OnInit, effect } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Router } from '@angular/router';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { ResourceTrackingService } from '@rt/resource-tracking.service';
import { MachineStatus } from '@rt/resource-tracking.model';
import { changeFactoryInUrl } from '@core/utils/formatters';
import {
  WsFactoryDisplayStream,
  consumerStreams,
  filterStreamFromWebsocketGateway$,
} from '@core/models/websocket.model';

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
  private placeholder$ = new Subject();

  constructor(
    private app: AppService,
    private rt: ResourceTrackingService,
    private notif: NotificationService,
    private route: Router,
    private zone: NgZone
  ) {
    super();

    effect(() => {
      this.placeholder$.next(this.app.factory());
    });
  }

  ngOnInit(): void {
    filterStreamFromWebsocketGateway$(this.app.wsGateway$, consumerStreams.FACTORY_DISPLAY).subscribe(res => {
      const msg = res.data as WsFactoryDisplayStream;
      this.zone.run(() => {
        this.route.navigate(changeFactoryInUrl(this.route, msg.factory), {
          queryParams: this.route.routerState.snapshot.root.children[0].queryParams,
          queryParamsHandling: 'merge',
        });
      });
    });

    this.placeholder$
      .pipe(
        switchMap(_ => {
          return this.rt.fetchMachinesStatus$(this.app.factory());
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe({
        next: res => {
          this.isLoading = false;

          // For layout plan.
          this.machinesStatus = res;

          // For displaying tables.
          this.machinesData = [];
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

    this.placeholder$.next(true);
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
