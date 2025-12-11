import {Component, OnInit, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Keycloak from 'keycloak-js';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {GuestService} from '../../services/guest.service';
import {Guest} from '../../models/guest.model';
import {MatIcon} from '@angular/material/icon';
import {setYear} from 'date-fns';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule, MatIcon, MatIcon],
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

  today = new Date();
  nextYear = new Date(setYear(this.today, this.today.getFullYear()+1));

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
    const formValue = this.searchForm.value;
    const dateA: string = formValue.checkin;
    const dateB: string = formValue.checkout;

    if (dateA === dateB) {
      alert("Le date di arrivo e partenza devono essere diverse!");
      return;
    }

    if(dateA < this.dateToString(this.today) || dateB < this.dateToString(this.today)) {
      alert("Puoi prenotare solo da oggi in poi!")
      return;
    }

    if(dateA > this.dateToString(this.nextYear) || dateB > this.dateToString(this.nextYear)) {
      alert("Puoi prenotare per massimo l'anno prossimo!")
      return;
    }

    let checkinDate : String;
    let checkoutDate : String;

    //Funziona perché la data è YYYY/MM/DD
    if (dateA < dateB) {
      checkinDate = dateA;
      checkoutDate = dateB;
    } else {
      checkinDate = dateB;
      checkoutDate = dateA;
    }

    const queryParams = {
      checkin: checkinDate,
      checkout: checkoutDate,
      minSize: formValue.minSize,
      minGuests: formValue.minGuests,
    };

    this.router.navigate(['/'], {
      queryParams: queryParams
    });
    }

  async syncUser() {
    if(!this.isAdmin()){
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
    } else {
      this.redirectToAdmin()
    }
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

  dateToString(data : Date | null) : string{
    if (data)
      return data.toISOString().split('T')[0]
    return ''
  }

}
