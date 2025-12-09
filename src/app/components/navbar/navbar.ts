import {Component, OnInit, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Keycloak from 'keycloak-js';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {GuestService} from '../../services/guest.service';
import {Guest} from '../../models/guest.model';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  guest : Guest | null = null;
  searchForm!: FormGroup;
  guestService = inject(GuestService)
  readonly keycloak = inject(Keycloak);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    this.searchForm = this.fb.group({
      checkin: ['', Validators.required],
      checkout: ['', Validators.required],
      minSize: [null],
      minGuests: [null]
    });

    if(this.keycloak.authenticated)
      await this.syncUser()
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

  async syncUser() {
    try {
      const profile = await this.keycloak.loadUserProfile();

      const newGuest: Guest = {
        id: 0,
        code: this.keycloak.subject!,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email!
      };

      this.guest = newGuest
      this.guestService.registerGuest(newGuest).subscribe({
        next: (res) => console.log('Utente salvato nel DB:', res),
        error: (err) => {
          if (err.status === 409) console.log('Utente già esistente.');
        }
      });

    } catch (e) {
      console.error('Errore nel caricamento profilo:', e);
    }
    this.redirectToAdmin()
  }

   async register(){
    if(this.keycloak.authenticated)
      await this.keycloak.logout()
    await this.keycloak.register()
  }

  async login() {
    await this.keycloak.login({redirectUri: window.location.href})
  }

  async logout() {
    await this.keycloak.logout()
  }

  isAdmin(): boolean {
    return this.keycloak.hasRealmRole("RECEPTIONIST") || this.keycloak.hasRealmRole("OWNER");
  }

  redirectToAdmin(): void {
    if(this.isAdmin())
      this.router.navigate(['/admin'])
  }
}
