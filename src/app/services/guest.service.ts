import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Guest} from '../models/guest.model';
import {Reservation} from '../models/reservation.model';
import {Room} from '../models/room.model';

@Injectable({ providedIn : 'root' })
export class GuestService{
  private url = "http://localhost:8080/api/guests"

  constructor(private http: HttpClient) {}

  registerGuest(guest : Guest) : Observable<Guest>{
    return this.http.post<Guest>(`${this.url}`, guest)
  }


  getAllGuests(): Observable<Guest[]>{
    return this.http.get<Guest[]>(`${this.url}`)
  }

  getCurrentGuest() : Observable<Guest>{
    return this.http.get<Guest>(`${this.url}/me`)
  }

  getReservations() : Observable<Reservation[]>{
    return this.http.get<Reservation[]>(`${this.url}/reservations`)
  }

  getInHouse() : Observable<Guest[]>{
    return this.http.get<Guest[]>(`${this.url}/inHouse`)
  }

  getRoom(guest: Guest) {
    return this.http.get<Room>(`${this.url}/${guest.id}/room`)
  }
}
