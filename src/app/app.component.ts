import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { KeycloakAngularModule } from 'keycloak-angular';

import { SharedModule } from '@shared/shared.module';
import { AppService } from '@core/services/app.service';
import { FallbackComponent } from '@core/components/fallback/fallback.component';
import { UnauthorizedComponent } from '@core/components/unauthorized/unauthorized.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, KeycloakAngularModule, FallbackComponent, UnauthorizedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
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
