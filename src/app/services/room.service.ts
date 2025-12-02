import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Room} from '../models/room.model';
import {Observable} from 'rxjs';
import {RoomState, RoomType} from '../models/enums/room-types.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private url = "http://localhost:8080/api/rooms"

  constructor(private http: HttpClient) {}

  addRoom(room : Room): Observable<Room>{
    return this.http.post<Room>(this.url, room)
  }

  getAllRooms(): Observable<Room[]>{
    return this.http.get<Room[]>(this.url);
  }

  getRoom(roomNumber : number): Observable<Room>{
    return this.http.get<Room>(`${this.url}/${roomNumber}`)
  }

  searchRoomsAdvanced(
    checkin: string,
    checkout: string,
    types: RoomType[],
    maxPrice: number,
    minSize: number
  ): Observable<Room[]> {

    let params = new HttpParams()
      .set('checkin', checkin)
      .set('checkout', checkout)
      .set('maxPrice', maxPrice.toString())
      .set('minSize', minSize.toString());

    const typeStrings = types.join(',');
    params = params.set('types', typeStrings);

    return this.http.get<Room[]>(`${this.url}/search`, { params: params });
  }


  updateRoom(roomNumber : number, room : Room) : Observable<Room>{
    return this.http.put<Room>(`${this.url}/${roomNumber}`, room)
  }

  updateRoomState(roomNumber : number, state : RoomState) : Observable<Room>{
    return this.http.put<Room>(`${this.url}/${roomNumber}/state`, state)
  }


  deleteRoom(roomNumber :  number) : Observable<Room>{
    return this.http.delete<Room>(`${this.url}/${roomNumber}`)
  }
}
