import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';

import { AppService } from '@core/services/app.service';
import { SharedModule } from '@shared/shared.module';
import { CancelSubscription } from '@shared/classes/cancel-subscription/cancel-subscription.class';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent extends CancelSubscription implements OnInit {
  public header: string;

  constructor(private app: AppService) {
    super();
  }

  ngOnInit(): void {
    this.app.factory$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res === 'modelfactory') this.header = 'Model Factory';
      else if (res === 'microfactory') this.header = 'Micro Factory';
    });
  }
}
