import {Room} from './room.model';
import {Guest} from './guest.model';
import {PaymentStatus} from './enums/payment-status.model';

export interface Reservation {
  id: number;
  room: Room;
  guest: Guest;
  checkin: string;
  checkout: string;
  price: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
}
