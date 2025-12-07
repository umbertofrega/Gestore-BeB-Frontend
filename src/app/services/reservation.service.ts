import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reservation} from '../models/reservation.model';

@Injectable({ providedIn: 'root' })

export class ReservationService {

  private url = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  addReservation(reservation : Reservation) : Observable<Reservation>{
    return this.http.post<Reservation>(`${this.url}`, reservation)
  }

  getAllReservations() : Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.url}`)
  }

  getReservation(reservationId : number) : Observable<Reservation> {
    return this.http.get<Reservation>(`${this.url}/${reservationId}`)
  }

  getOnlyPending() : Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.url}/search`)
  }

  updateStatus(reservationId : number) : Observable<Reservation>{
    return this.http.put<Reservation>(`${this.url}/${reservationId}`,reservationId)
  }

  deleteReservation(reservationId : number): Observable<Reservation>{
    return this.http.delete<Reservation>(`${this.url}/${reservationId}`)
  }
}
