import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Dropdown } from '@core/classes/form/form.class';
import {
  WsFactoryDisplayStream,
  consumerStreams,
  filterStreamFromWebsocketGateway$,
} from '@core/models/websocket.model';
import { AppService } from '@core/services/app.service';
import { changeFactoryInUrl } from '@core/utils/formatters';
import { faArrowTrendUp, faArrowTrendDown, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { ManagementLayerOneData } from '@mk/management-kpis-model';
import { ManagementKpisService } from '@mk/management-kpis-service';
import { Subscription, Observable, map } from 'rxjs';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent implements OnInit, OnDestroy {
  displayDataSetOne: ManagementLayerOneData[];
  faTrendUp = faArrowTrendUp;
  faTrendDown = faArrowTrendDown;
  faRightLong = faRightLong;
  $subscription: Subscription = new Subscription();
  frequency: string = 'weekly';
  filter$: Observable<string>;
  kpiSide: string;
  //Removed Half Year and Yearly for now
  public period: Dropdown[] = ['WEEKLY', 'MONTHLY', 'QUARTERLY'].map(row => {
    return {
      text: row,
      value: row,
    };
  });
  public projection: Dropdown[] = ['30 DAYS'].map(row => {
    return {
      text: row,
      value: row,
    };
  });

  constructor(
    private app: AppService,
    private mk: ManagementKpisService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private zone: NgZone
  ) {}

  ngOnInit() {
    filterStreamFromWebsocketGateway$(this.app.wsGateway$, consumerStreams.FACTORY_DISPLAY).subscribe(res => {
      const msg = res.data as WsFactoryDisplayStream;
      this.zone.run(() => {
        this.route.navigate(changeFactoryInUrl(this.route, msg.factory), {
          queryParams: this.route.routerState.snapshot.root.children[0].queryParams,
          queryParamsHandling: 'merge',
        });
      });
    });

    // this.period.forEach(item => item.text.toUpperCase());
    this.filter$ = this.activatedRoute.queryParamMap.pipe(map((params: ParamMap) => params.get('kpiSide') ?? ''));
    this.filter$.subscribe(side => {
      this.kpiSide = side;
      this.retrieveKPIData(); // Move data retrieval inside subscription to ensure kpiSide is set before fetching
    });
  }
  retrieveKPIData() {
    this.$subscription.add(
      this.mk
        .fetchManagementKPILayerOneData$(this.app.factory(), this.frequency)
        .subscribe((res: ManagementLayerOneData[]) => {
          if (this.kpiSide === 'left') {
            this.displayDataSetOne = res.slice(0, 4);
          } else {
            this.displayDataSetOne = res.slice(4, 8);
            this.displayDataSetOne = this.displayDataSetOne.map(item => {
              if (item.Category === 'Capacity Utilization') {
                return { ...item, Category: 'Capacity Utilisation' };
              }
              return item;
            });
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  public onTogglePeriod(event: unknown) {
    const newFrequency = event as string;
    // Check if the new frequency is different to avoid unnecessary fetching
    if (newFrequency !== this.frequency) {
      this.frequency = newFrequency;
      // Unsubscribe from any existing subscription to prevent memory leaks
      this.$subscription.unsubscribe();
      // Create a new subscription for the new data
      this.$subscription = new Subscription();

      // Fetch or filter the dataset based on the new frequency
      this.retrieveKPIData();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onToggleProjection(event: unknown) {}
}
