import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Keycloak from 'keycloak-js';
import {AdminRole} from '../../models/enums/admin-role.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {

  public isLoggedIn = false;
  public userRoles: string[] = [];

  private readonly keycloak = inject(Keycloak);

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = this.keycloak.authenticated ?? false;

    if (this.isLoggedIn) {
      this.userRoles = this.keycloak.realmAccess?.roles || [];
    }
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  isAdminAreaVisible(): boolean {
    return this.userRoles.includes(AdminRole.OWNER) || this.userRoles.includes(AdminRole.RECEPTIONIST);
  }
}
