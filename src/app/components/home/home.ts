import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router'; // ActivatedRoute serve per leggere l'URL
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room.model';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  private roomService = inject(RoomService);
  protected route = inject(ActivatedRoute);
  keycloak = inject(Keycloak)
  rooms: Room[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['checkin'] && params['checkout']) {
        this.performSearch(params);
      } else {
        this.loadAllRooms();
      }
    });
  }

  hasSearched(): boolean {
    const params = this.route.snapshot.queryParams;

    return !!params['checkin'] && !!params['checkout'];
  }

  loadAllRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (data) => this.rooms = data,
      error: (err) => console.error('Errore loadAll:', err)
    });
  }

  performSearch(params: any) {
    console.log("Parametri ricevuti dalla Navbar:", params);

    const typesToSend = params['type'] ? [params['type']] : [];

    this.roomService.searchRoomsAdvanced(
      params['checkin'],
      params['checkout'],
      typesToSend,
      params['maxPrice'] || 500,
      params['minSize'] || 0
    ).subscribe({
      next: (data) => this.rooms = data,
      error: (err) => {
        console.error('Errore ricerca:', err);
        this.rooms = [];
      }
    });
  }
}
