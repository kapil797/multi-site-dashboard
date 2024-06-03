import { Component, OnInit } from '@angular/core';
import { ReplaySubject, switchMap, take, takeUntil } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { AppService } from '@core/services/app.service';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { createNotif } from '@core/utils/notification';
import { FulfillmentService } from '@ful/fulfillment.service';
import { DemandProfile, Product } from '@ful/fulfillment.model';
import { Dropdown } from '@core/classes/form/form.class';

interface Forecast {
  horizonMonths: number;
  product: Product;
  algo: string;
}

@Component({
  selector: 'app-layer-two',
  templateUrl: './layer-two.component.html',
  styleUrl: './layer-two.component.scss',
})
export class LayerTwoComponent extends CancelSubscription implements OnInit {
  public isLoading = true;
  public demandProfile: DemandProfile;
  public title: string;
  public products: Dropdown[] = ['ESCENTZ', 'MFCONNECT+'].map(row => {
    return {
      text: row,
      value: row,
    };
  });
  public algos: Dropdown[] = ['ALGO1 (BEST)', 'ALGO2', 'ALGO3'].map(row => {
    return {
      text: row,
      value: row,
    };
  });
  public forecastingHorizon: Dropdown[] = [
    {
      text: '1 MONTH',
      value: 1,
    },
    {
      text: '6 MONTHS',
      value: 6,
    },
  ];
  private sub$ = new ReplaySubject<Forecast>();

  constructor(
    private app: AppService,
    private dp: FulfillmentService,
    private notif: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub$
      .pipe(
        switchMap(res => {
          this.title = `DEMAND FOR ${res.product} (PCS)`;
          return this.dp.fetchDemandProfile$(this.app.factory(), res.product, res.horizonMonths);
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe({
        next: res => {
          this.demandProfile = res;
          this.isLoading = false;
        },
        error: (error: Error) => {
          this.isLoading = false;
          this.notif.show(createNotif('error', error.message));
        },
      });

    this.sub$.next({
      product: 'ESCENTZ',
      horizonMonths: 3,
      algo: 'DUMMY',
    });
  }

  public onToggleProduct(event: unknown) {
    this.sub$.pipe(take(1)).subscribe(res => {
      this.sub$.next({
        product: event as Product,
        horizonMonths: res.horizonMonths,
        algo: res.algo,
      });
    });
  }

  public onToggleAlgo(event: unknown) {
    this.sub$.pipe(take(1)).subscribe(res => {
      this.sub$.next({
        product: res.product,
        horizonMonths: res.horizonMonths,
        algo: event as string,
      });
    });
  }

  public onToggleHorizon(event: unknown) {
    this.sub$.pipe(take(1)).subscribe(res => {
      this.sub$.next({
        product: res.product,
        horizonMonths: event as number,
        algo: res.algo,
      });
    });
  }
}
