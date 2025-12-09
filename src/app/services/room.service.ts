import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Room} from '../models/room.model';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
class RoomService {
  private url = "http://localhost:8080/api/rooms"

  constructor(private http: HttpClient) {}

  addRoom(room : Room): Observable<Room>{
    return this.http.post<Room>(this.url, room)
  }

  getRoom(roomNumber : number): Observable<Room>{
    return this.http.get<Room>(`${this.url}/${roomNumber}`)
  }

  getAllRooms(): Observable<Room[]>{
    return this.http.get<Room[]>(this.url);
  }

  searchRoomsAdvanced(
    checkin: string, checkout: string, minGuests: number, maxPrice: number, minSize: number  ): Observable<Room[]> {

    let params = new HttpParams()
      .set('checkin', checkin)
      .set('checkout', checkout)
      .set('maxPrice', maxPrice.toString())
      .set('minSize', minSize.toString())
      .set('minGuests', minGuests.toString());

    return this.http.get<Room[]>(`${this.url}/search`, { params: params });
  }

  updateRoom(roomNumber : number, room : Room) : Observable<Room>{
    return this.http.put<Room>(`${this.url}/${roomNumber}`, room)
  }


  deleteRoom(roomNumber :  number) : Observable<Room>{
    return this.http.delete<Room>(`${this.url}/${roomNumber}`)
  }
}

export default RoomService
