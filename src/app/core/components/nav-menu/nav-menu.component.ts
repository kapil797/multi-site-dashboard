import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '@shared/shared.module';
import { AppService } from '@core/services/app.service';
import { NavItem, mfNavItems } from './nav-menu.constant';
import { Router } from '@angular/router';
import { TileLayoutReorderEvent } from '@progress/kendo-angular-layout';
import { CancelSubscription } from '@shared/classes/cancel-subscription.class';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NavMenuComponent extends CancelSubscription implements OnInit {
  public columns = 4;
  public navItems: NavItem[];
  public factoryMap: string;
  public mf = 'assets/images/factories/big.png';
  public umf = 'assets/images/factories/small.png';

  constructor(
    private router: Router,
    private app: AppService
  ) {
    super();
  }

  ngOnInit(): void {
    this.app.factory$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res === 'MF') {
        this.navItems = mfNavItems;
        this.factoryMap = 'assets/images/factories/map-mf.png';
      } else {
        this.factoryMap = 'assets/images/factories/map-umf.png';
      }
    });
  }

  public onClick(event: unknown) {
    console.log(event);
  }

  public onReorder(event: TileLayoutReorderEvent) {
    event.preventDefault();
  }
}
