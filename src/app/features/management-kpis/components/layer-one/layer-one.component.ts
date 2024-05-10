import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowTrendUp, faArrowTrendDown, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { Subscription, takeUntil } from 'rxjs';

import { Dropdown } from '@core/classes/form/form.class';
import { LayerOneRouter } from '@core/classes/layer-one-router/layer-one-router.class';
import { AppService } from '@core/services/app.service';
import { ManagementLayerOneData } from '@mk/management-kpis-model';
import { ManagementKpisService } from '@mk/management-kpis-service';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent extends LayerOneRouter implements OnInit, OnDestroy {
  private subscription$ = new Subscription();
  private frequency: string = 'weekly';
  private isExtended: string | null;
  public displayDataSetOne: ManagementLayerOneData[];
  public faTrendUp = faArrowTrendUp;
  public faTrendDown = faArrowTrendDown;
  public faRightLong = faRightLong;

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
    protected override route: Router,
    protected override zone: NgZone,
    protected override app: AppService,
    private mk: ManagementKpisService,
    private activatedRoute: ActivatedRoute
  ) {
    super(route, zone, app);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.activatedRoute.queryParamMap.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      this.isExtended = res.get('extended');
      this.retrieveKPIData(); // Move data retrieval inside subscription to ensure kpiSide is set before fetching
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subscription$.unsubscribe();
  }

  private retrieveKPIData() {
    this.subscription$.add(
      this.mk
        .fetchManagementKPILayerOneData$(this.app.factory(), this.frequency)
        .subscribe((res: ManagementLayerOneData[]) => {
          if (!this.isExtended) {
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

  public onTogglePeriod(event: unknown) {
    const newFrequency = event as string;
    // Check if the new frequency is different to avoid unnecessary fetching
    if (newFrequency !== this.frequency) {
      this.frequency = newFrequency;
      // Unsubscribe from any existing subscription to prevent memory leaks
      this.subscription$.unsubscribe();
      // Create a new subscription for the new data
      this.subscription$ = new Subscription();

      // Fetch or filter the dataset based on the new frequency
      this.retrieveKPIData();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onToggleProjection(event: unknown) {}
}
