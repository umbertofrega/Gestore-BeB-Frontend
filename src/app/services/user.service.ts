import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService{
  private url = "http://localhost:8080/api/users"

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User>{
    return this.http.get<User>(`${this.url}`)
  }
}
