import {Component, OnInit, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Keycloak from 'keycloak-js';
import { AdminRole } from '../../models/enums/admin-role.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomType } from '../../models/enums/room-types.model';
import { CommonModule } from '@angular/common';
import {GuestService} from '../../services/guest.service';
import {Guest} from '../../models/guest.model';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  public userRoles: string[] = [];
  guest : Guest | null = null;
  searchForm!: FormGroup;
  guestService = inject(GuestService)
  roomTypes = Object.values(RoomType);
  readonly keycloak = inject(Keycloak);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  async ngOnInit(): Promise<void> {
    this.searchForm = this.fb.group({
      checkin: ['', Validators.required],
      checkout: ['', Validators.required],
      type: [null],
    });

    this.keycloak.onAuthSuccess = () =>{
     this.syncUser()
    }
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
        code: this.keycloak.subject!, // UUID
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
  }

   async register(){
    if(this.keycloak.authenticated)
      await this.keycloak.logout()
     this.keycloak.register()
  }

  login() {
    this.keycloak.login()
  }

  logout() {
    this.keycloak.logout()
  }

  isAdmin(): boolean {
    return this.userRoles.includes(AdminRole.OWNER) || this.userRoles.includes(AdminRole.RECEPTIONIST);
  }
}
