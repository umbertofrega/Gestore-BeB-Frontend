import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Keycloak from 'keycloak-js';
import { AdminRole } from '../../models/enums/admin-role.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomType } from '../../models/enums/room-types.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  public userRoles: string[] = [];
  searchForm!: FormGroup;
  roomTypes = Object.values(RoomType);
  isLoggedIn = false;
  private readonly keycloak = inject(Keycloak);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    this.keycloak.init()
    this.isLoggedIn = this.keycloak.authenticated
    this.searchForm = this.fb.group({
      checkin: ['', Validators.required],
      checkout: ['', Validators.required],
      type: [null],
    });
  }

  onSearch() {
    if (this.searchForm.invalid) {
      alert("Inserisci le date per cercare!");
      return;
    }

    this.router.navigate(['/'], {
      queryParams: this.searchForm.value
    });
  }

  login() { this.keycloak.login(); }
  logout() { this.keycloak.logout(); }
  isAdminAreaVisible(): boolean {
    return this.userRoles.includes(AdminRole.OWNER) || this.userRoles.includes(AdminRole.RECEPTIONIST);
  }
}
