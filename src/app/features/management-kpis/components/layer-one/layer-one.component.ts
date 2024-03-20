import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Dropdown } from '@core/classes/form/form.class';
import { faArrowTrendUp, faArrowTrendDown, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { ManagementLayerOneData } from '@mk/management-kpis-model';
import { ManagementKpisService } from '@mk/management-kpis-service';
import { Subscription, Observable, map } from 'rxjs';

@Component({
  selector: 'app-layer-one',
  templateUrl: './layer-one.component.html',
  styleUrl: './layer-one.component.scss',
})
export class LayerOneComponent {
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
    private mk: ManagementKpisService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.period.forEach(item => item.text.toUpperCase());
    this.filter$ = this.route.queryParamMap.pipe(map((params: ParamMap) => params.get('kpiSide') ?? ''));
    this.filter$.subscribe(side => {
      this.kpiSide = side;
      this.retrieveKPIData(); // Move data retrieval inside subscription to ensure kpiSide is set before fetching
    });
  }
  retrieveKPIData() {
    this.$subscription.add(
      this.mk.fetchManagementKPILayerOneData(this.frequency).subscribe((res: ManagementLayerOneData[]) => {
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
      console.log('Selected frequency:', this.frequency);
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
