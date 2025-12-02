import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Admin} from '../models/admin.model';

@Injectable({ providedIn : 'root' })
export class AdminService{
  private url = "http://localhost:8080/api/admins"

  constructor(private http: HttpClient) {}

  registerAdmin(admin : Admin) : Observable<Admin>{
    return this.http.post<Admin>(`${this.url}`, admin)
  }


  getAllAdmins(): Observable<Admin[]>{
    return this.http.get<Admin[]>(`${this.url}`)
  }

}
