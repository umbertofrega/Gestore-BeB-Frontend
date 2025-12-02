import {Component, inject, OnInit} from '@angular/core';
import Keycloak from 'keycloak-js';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isLoggedIn = false;
  public userRoles: string[] = [];

  private readonly keycloak= inject(Keycloak);

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = this.keycloak.loginRequired
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
