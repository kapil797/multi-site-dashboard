import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

interface Attributes {
  [key: string]: string[];
}

export interface UserProfile extends KeycloakProfile {
  attributes: Attributes;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userProfile$ = new BehaviorSubject<UserProfile | null>(null);

  constructor(private readonly keycloakService: KeycloakService) {}

  public async onLogOut() {
    await this.keycloakService.logout();
    this.userProfile$.next(null);
  }

  public async initAfterLogIn() {
    const userProfile = (await this.keycloakService.loadUserProfile()) as UserProfile;
    const roles = this.keycloakService.getUserRoles();
    userProfile.roles = roles;
    this.userProfile$.next(userProfile);
  }
}
