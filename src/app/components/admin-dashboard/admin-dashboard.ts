import {Component, inject, OnInit} from '@angular/core';
import {GuestService} from '../../services/guest.service';
import {ReservationService} from '../../services/reservation.service';
import {RoomService} from '../../services/room.service';
import {Guest} from '../../models/guest.model';
import {Room} from '../../models/room.model';
import {Reservation} from '../../models/reservation.model';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    DatePipe,
    NgClass
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
  reservations : Reservation[] = [
  ]

  ngOnInit() {
    this.loadAllGuests();
    this.loadAllRooms();
    this.loadAllReservations();
  }

  loadAllGuests(){
    this.guestService.getAllGuests().subscribe({
      next: (guestData) => {
        this.guests = guestData;
      },
      error : err => console.error('Errore ricezione ospiti', err)
    })
  }

  addRoom(number : number){
    this.roomService.deleteRoom(number)
  }

  deleteRoom(number: number) {
    this.roomService.deleteRoom(number)
  }

  editRoom(number : number){
    //TODO
  }
  loadAllRooms(){
    this.roomService.getAllRooms().subscribe({
      next: (roomData) => {
        this.rooms = roomData;
      },
      error: err => console.error('Errore ricezione stanze',err)
    })
  }

  loadAllReservations() {
    this.reservationService.getAllReservations().subscribe({
      next: (reservationsData) => {
        this.reservations = reservationsData;
      },
      error: (err) => console.error('Errore ricezione prenotazioni:', err)
    });
  }

  protected updateReservation() {

  }
}

