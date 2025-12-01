import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Reservation} from '../models/reservation.model';
import {RoomType} from '../models/enums/room-types.model';
import {PaymentStatus} from '../models/enums/payment-status.model';

@Injectable({ providedIn: 'root' })

export class ReservationService {

  private url = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  addReservation(reservation : Reservation) : Observable<Reservation>{
    return this.http.post<Reservation>(`${this.url}`, reservation)
  }

  getAllReservations() : Observable<Reservation> {
    return this.http.get<Reservation>(`${this.url}`)
  }

  getReservation(reservationId : number) : Observable<Reservation> {
    return this.http.get<Reservation>(`${this.url}/${reservationId}`)
  }

  searchReservation(type : RoomType) : Observable<Reservation[]> {
    const params = new HttpParams().set('type' , type)
    return this.http.get<Reservation[]>(`${this.url}/search`,  { params: params })
  }


  updateStatus(status : PaymentStatus, reservationId : number) : Observable<Reservation>{
    return this.http.post<Reservation>(`${this.url}/${reservationId}`, status)
  }

  deleteReservation(reservationId : number): Observable<Reservation>{
    return this.http.delete<Reservation>(`${this.url}/${reservationId}`)
  }
}
