import {Component, inject, OnInit} from '@angular/core';
import {Room} from '../../models/room.model';
import {RoomService} from '../../services/room.service';
import {ActivatedRoute, Router} from "@angular/router";
import {Reservation} from '../../models/reservation.model';
import {ReservationService} from '../../services/reservation.service';
import {PaymentStatus} from '../../models/enums/payment-status.model';
import {GuestService} from '../../services/guest.service';
import {Guest} from '../../models/guest.model';
import { differenceInDays } from 'date-fns';


@Component({
  selector: 'app-room-detail',
  imports: [],
  templateUrl: './room-detail.html',
  styleUrl: './room-detail.css',
})
export class RoomDetail implements OnInit{

  room : Room | null  = null;
  roomService : RoomService = inject(RoomService);
  reservationService : ReservationService = inject(ReservationService);
  guestService : GuestService = inject(GuestService);
  reservation : Reservation | null = null;
  guest : Guest | null = null;
  private router = inject(Router);

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  async ngOnInit() {
    const number = this.route.snapshot.paramMap.get('number');

    this.guestService.getCurrentGuest().subscribe({
        next: (data) => {
          this.guest = data;
          if (number)
            this.loadRoomDetail(number)
        },
      }
    )
  }

  loadRoomDetail(roomNumber : String) {
    this.roomService.getRoom(+roomNumber).subscribe({
          next: (data) => {
            this.room = data;
            this.loadReservation();
          },
        error: (err) => console.error('Errore nella stanza passata:', err)
      },
    );
  }

  loadReservation(){

    if(this.guest == null) {
      console.error("Errore nella registrazione della prenotazione, utente null")
      return
    }
    if(this.room == null) {
      console.error("Errore nella registrazione della prenotazione, stanza null")
      return
    }

    const checkinString = this.route.snapshot.queryParams['checkin'];
    const checkoutString = this.route.snapshot.queryParams['checkout'];

    const checkinDate = new Date(checkinString);
    const checkoutDate = new Date(checkoutString);

    const totalNights = differenceInDays(checkinDate, checkoutDate)

    const totalPrice = this.room.price * totalNights;

     this.reservation = {
      room: this.room,
      guest: this.guest,
      checkin: checkinString,
      checkout: checkoutString,
      price: totalPrice,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: new Date().toISOString()
    };
  }

  reserve(){
    if (this.reservation) {
      this.reservationService.addReservation(this.reservation).subscribe({
        next: (res) => {
          console.log('Prenotazione creata con successo:', res);
          this.router.navigate(['/me']);
        },
        error: (err) => console.error('Errore nella creazione della prenotazione:', err)
      });
    } else {
      console.error("Errore: Impossibile procedere, l'oggetto prenotazione è null.");
    }
  }

}
