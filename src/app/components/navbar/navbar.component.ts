import {Component, inject, OnInit} from '@angular/core';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {

  public isLoggedIn = false;
  public userRoles: string[] = [];

  private readonly keycloak= inject(Keycloak);

  async ngOnInit(): Promise<void> {
    this.keycloak.userInfo;
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }

  isUserAdmin(): boolean {
    return this.userRoles.includes('OWNER') || this.userRoles.includes('RECEPTIONIST');
  }
}
