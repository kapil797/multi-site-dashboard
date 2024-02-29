import { Component, effect } from '@angular/core';

import { AppService } from '@core/services/app.service';
import { SharedModule } from '@shared/shared.module';
import { CancelSubscription } from '@core/classes/cancel-subscription/cancel-subscription.class';
import { Factory } from '@core/models/factory.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent extends CancelSubscription {
  public header: string;

  constructor(private app: AppService) {
    super();

    effect(() => {
      switch (this.app.factory()) {
        case Factory.MODEL_FACTORY:
          this.header = 'Model Factory';
          break;
        case Factory.MICRO_FACTORY:
          this.header = 'Micro Factory';
          break;
      }
    });
  }
}
