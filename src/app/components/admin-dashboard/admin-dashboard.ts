import {Component, inject, OnInit} from '@angular/core';
import {GuestService} from '../../services/guest.service';
import {ReservationService} from '../../services/reservation.service';
import {RoomService} from '../../services/room.service';
import {Guest} from '../../models/guest.model';
import {Room} from '../../models/room.model';
import {Reservation} from '../../models/reservation.model';
import {DatePipe, NgClass} from '@angular/common';
import {PaymentStatus} from '../../models/enums/payment-status.model';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ConfirmDialog} from '../confirm-dialog/confirm-dialog';
import {RoomFormDialog} from '../room-form-dialog/room-form-dialog';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    DatePipe,
    NgClass,
    MatDialogModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{
  guestService = inject(GuestService)
  reservationService = inject(ReservationService)
  roomService = inject(RoomService)
  guests : Guest[] = []
  rooms : Room[] = []
  protected readonly PaymentStatus = PaymentStatus;
  reservations : Reservation[] = []
  dialog = inject(MatDialog)

  ngOnInit() {
      this.loadAllGuests();
      this.loadAllRooms();
      this.loadAllReservations();
  }

  protected loadAllGuests(){
    this.guestService.getAllGuests().subscribe({
      next: (guestData) => {
        this.guests = guestData;
      },
      error : err => console.error('Errore ricezione ospiti', err)
    })
  }

  protected addRoom(){
    const dialogRef = this.dialog.open(RoomFormDialog, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roomService.addRoom(result).subscribe(() => this.loadAllRooms()) ;
      }
    });
  }

  protected deleteRoom(number: number) {
    const matDialogRef = this.dialog.open(ConfirmDialog,{
      data: { title : "Confermi?" ,message: `Vuoi davvero cancellare la stanza ${number}?`}
    });

    matDialogRef.afterClosed().subscribe( result => {
      if(result){
        this.roomService.deleteRoom(number).subscribe( () => this.loadAllRooms())
      }
    })
  }

  protected editRoom(oldRoom : Room){
    const dialogRef = this.dialog.open(RoomFormDialog, {
      width: '600px',
      data: oldRoom
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roomService.updateRoom(oldRoom.number, result).subscribe(() => this.loadAllRooms());
      }
    });
  }


  protected loadAllRooms(){
    this.roomService.getAllRooms().subscribe({
      next: (roomData) => {
        this.rooms = roomData;
      },
      error: err => console.error('Errore ricezione stanze',err)
    })
  }

  protected loadAllReservations() {
    this.reservationService.getAllReservations().subscribe({
      next: (reservationsData) => {
        this.reservations = reservationsData;
      },
      error: (err) => console.error('Errore ricezione prenotazioni:', err)
    });
  }

  protected updateReservation(reservationId: number) {
    this.reservationService.updateStatus(reservationId).subscribe(
      () => this.loadAllReservations()
    )
  }

  protected loadOnlyPending(){
    this.reservationService.getOnlyPending().subscribe({
      next: (reservationData) => {
        this.reservations = reservationData
    },
      error : err => console.error('Errore ricezione prenotazioni', err)
    }
    )
  }

  protected loadOnlyGuestsInHouse() {
    this.guestService.getInHouse().subscribe({
      next: (guestData) => {
        this.guests = guestData;
      },
      error : err => console.error('Errore ricezione ospiti', err)
    })
  }

}

