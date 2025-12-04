import {Component, inject, OnInit} from '@angular/core';
import {GuestService} from '../../services/guest.service';
import {Guest} from '../../models/guest.model';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  guest : Guest | null = null;
  guestService = inject(GuestService)


  ngOnInit(){
    this.guestService.getCurrentGuest().subscribe({
      next: (data) => this.guest = data,
      error: (err) => console.error('Errore ricezione guest:', err)
    })
  }

  getReservation(){

  }
}
