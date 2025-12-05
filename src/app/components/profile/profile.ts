import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common'; // Import necessario per i template
import {GuestService} from '../../services/guest.service';
import {Guest} from '../../models/guest.model';
import {Reservation} from '../../models/reservation.model';

@Component({
  selector: 'app-profile',
  standalone: true, // Ricorda standalone: true se usi inject() fuori dal costruttore
  imports: [CommonModule], // Aggiungi CommonModule per il template
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  guest : Guest | null = null;
  guestService = inject(GuestService)
  reservations : Reservation[] = []

  ngOnInit(){
    this.guestService.getCurrentGuest().subscribe({
      next: (guestData) => {
        this.guest = guestData;
        this.guestService.getReservations().subscribe({
          next: (reservationsData) => {
            this.reservations = reservationsData;
          },
          error: (err) => console.error('Errore ricezione prenotazioni:', err)
        });
      },
      error: (err) => console.error('Errore ricezione guest:', err)
    });
  }
}
