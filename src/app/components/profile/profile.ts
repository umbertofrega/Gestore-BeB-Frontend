import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuestService} from '../../services/guest.service';
import {Guest} from '../../models/guest.model';
import {Reservation} from '../../models/reservation.model';
import {ReservationService} from '../../services/reservation.service';
import {Router} from '@angular/router';
import {differenceInDays} from 'date-fns';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  guest : Guest | null = null;
  guestService = inject(GuestService)
  reservationService = inject(ReservationService)
  reservations : Reservation[] = []
  private router = inject(Router);

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

  isRevocable(reservation : Reservation){
    const checkinDate = new Date(reservation.checkin);

    return differenceInDays(checkinDate, Date()) >= 7;
  }

  deleteReservation(reservationId: number | undefined){
    if(!reservationId)
      return;
    if (!confirm("Sei sicuro di voler revocare questa prenotazione? L'azione è irreversibile.")) {
      return;
    }
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
        alert("Prenotazione eliminata con successo! Controlla la tua casella di posta elettronica per l'email di conferma.")
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(`Errore nella revoca della prenotazione ${reservationId}:`, err);
        alert(`Errore nella revoca: ${err.error.message}`);
      }
    });
  }

  protected hasPassed(checkout: string) {
    const checkOutDate = new Date(checkout);
    return differenceInDays(checkOutDate, Date()) < 0
  }
}
