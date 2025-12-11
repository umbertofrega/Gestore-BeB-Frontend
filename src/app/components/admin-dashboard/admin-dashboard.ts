import {Component, inject, OnInit} from '@angular/core';
import {GuestService} from '../../services/guest.service';
import {ReservationService} from '../../services/reservation.service';
import RoomService from '../../services/room.service';
import {Guest} from '../../models/guest.model';
import {Room} from '../../models/room.model';
import {Reservation} from '../../models/reservation.model';
import {DatePipe, NgClass} from '@angular/common';
import {PaymentStatus} from '../../models/enums/payment-status.model';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ConfirmDialog} from '../confirm-dialog/confirm-dialog';
import {RoomFormDialog} from '../room-form-dialog/room-form-dialog';
import Keycloak from 'keycloak-js';
import {AdminService} from '../../services/admin.service';
import {Admin} from '../../models/admin.model';
import {AdminRole} from '../../models/enums/admin-role.model';

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
  adminService = inject(AdminService)
  reservationService = inject(ReservationService)
  roomService = inject(RoomService)
  guests : Guest[] = []
  guestRooms : Map<Guest,Room|null> = new Map()
  rooms : Room[] = []
  protected readonly PaymentStatus = PaymentStatus;
  reservations : Reservation[] = []
  keycloak = inject(Keycloak)
  dialog = inject(MatDialog)

  ngOnInit() {
    if(this.keycloak.authenticated && (this.keycloak.hasRealmRole("OWNER") || this.keycloak.hasRealmRole("RECEPTIONIST"))){
      this.loadAllGuests();
      this.loadAllRooms();
      this.loadAllReservations();
      this.addAdmin()
    }
  }

  protected loadAllGuests(){
    this.guestService.getAllGuests().subscribe({
      next: (guestData) => {
        this.guests = guestData;
        this.loadAllGuestRooms()
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
        this.roomService.addRoom(result).subscribe(() => {
          this.loadAllRooms()
          this.dialog.open(ConfirmDialog,{
            data:{title: "Operazione svolta", message:"Aggiunta della stanza avvenuta con successo"}})
         });
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

  protected loadAllGuestRooms() {
    for (let g of this.guests) {
      console.log(`Richiedo stanza per ${g.name}...`);

      this.guestService.getRoom(g).subscribe({
        next: (room: Room) => {
          console.log(`Stanza trovata per ${g.name}:`, room);

          this.guestRooms.set(g, room);
        },
        error: (err) => {
          console.log(`Nessuna stanza attiva per ${g.name}`, err);
          this.guestRooms.set(g, null);
        }
      });
    }
  }

  async addAdmin() {
    try {
      const profile = await this.keycloak.loadUserProfile()

      let role = AdminRole.RECEPTIONIST

      if(this.keycloak.hasRealmRole("OWNER"))
        role = AdminRole.OWNER


      const newAdmin: Admin = {
        id: 0,
        code: this.keycloak.subject!,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email!,
        role: role
      };

      this.adminService.registerAdmin(newAdmin)
    } catch (e) {
      console.error('Errore nel caricamento profilo:', e);
    }
  }
}


