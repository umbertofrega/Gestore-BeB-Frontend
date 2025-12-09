import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuestService} from '../../services/guest.service';
import {Guest} from '../../models/guest.model';
import {Reservation} from '../../models/reservation.model';
import {ReservationService} from '../../services/reservation.service';
import {Router} from '@angular/router';
import {differenceInDays} from 'date-fns';
import {ConfirmDialog} from '../confirm-dialog/confirm-dialog';
import {MatDialog} from '@angular/material/dialog';

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
  dialog = inject(MatDialog)

  ngOnInit(){
    this.guestService.getCurrentGuest().subscribe({
      next: (guestData) => {
        this.guest = guestData;
        this.loadAllReservations();
      },
      error: (err) => console.error('Errore ricezione guest:', err)
    });
  }

  isRevocable(reservation : Reservation){
    const checkinDate = new Date(reservation.checkin);

    return differenceInDays(checkinDate, Date()) >= 7;
  }

  deleteDilog(reservationId: number | undefined){
    if(!reservationId)
      return;

    const matDialogRef = this.dialog.open(ConfirmDialog,{
      data: { title : "Confermi?" ,message: `Vuoi davvero cancellare la prenotazione?`}
    });

      matDialogRef.afterClosed().subscribe((result: any) => {
      if(result && reservationId){
        this.deleteReservation(reservationId)
      }
    })
  }

  protected loadAllReservations(){
    this.guestService.getReservations().subscribe({
      next: (reservationsData) => {
        this.reservations = reservationsData;
      },
      error: (err) => console.error('Errore ricezione prenotazioni:', err)
    });
  }

  protected deleteReservation(reservationId: number){
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
        this.dialog.open(ConfirmDialog,{data: { title : "Operazione riuscita" ,message: `Prenotazione cancellata con successo`}});
        this.loadAllReservations();
      },
      error: (err) => {
        console.error(`Errore nella revoca della prenotazione ${reservationId}:`, err);
        this.dialog.open(ConfirmDialog,{data: { title : "Operazione riuscita" ,message: `Prenotazione cancellata con successo`}});
      }
    });
  }

  protected hasPassed(checkout: string) {
    const checkOutDate = new Date(checkout);
    return differenceInDays(checkOutDate, Date()) < 0
  }
}
