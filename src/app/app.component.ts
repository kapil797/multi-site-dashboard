import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Modules.
import { SharedModule } from '@shared/shared.module';
import { KeycloakAngularModule } from 'keycloak-angular';
import { ProductionTrackingModule } from '@pt/production-tracking.module';

// Services.
import { AppService } from '@core/services/app.service';

// Components.
import { FallbackComponent } from '@core/components/fallback/fallback.component';
import { UnauthorizedComponent } from '@core/components/unauthorized/unauthorized.component';
import { NavMenuComponent } from '@core/components/nav-menu/nav-menu.component';
import { dialogAnimation, routeAnimations } from '@core/utils/animations';

import { Dialogs } from '@core/constants/dialogs.constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    // Modules.
    HttpClientModule,
    SharedModule,
    KeycloakAngularModule,
    ProductionTrackingModule,
    // Components.
    FallbackComponent,
    UnauthorizedComponent,
    NavMenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [routeAnimations],
})
export class AppComponent {
  public Dialogs = Dialogs;
  public dialogAnimation = dialogAnimation;

  constructor(
    private contexts: ChildrenOutletContexts,
    public app: AppService
  ) {}

  public getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animationState'];
  }

  public onCloseDialog() {
    this.app.appDialog = null;
  }
}
