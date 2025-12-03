import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room.model';
import { RoomType } from '../../models/enums/room-types.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  private roomService = inject(RoomService);
  private fb = inject(FormBuilder);

  rooms: Room[] = [];
  searchForm!: FormGroup;
  roomTypes = Object.values(RoomType);

  ngOnInit() {
     this.loadAllRooms();

    this.searchForm = this.fb.group({
      checkin: ['', Validators.required],
      checkout: ['', Validators.required],
      type: [null],
      maxPrice: [500],
      minSize: [0]
    });
  }

  loadAllRooms() {
    console.log("Caricamento stanze default...");
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        console.log("Stanze trovate:", data);
        this.rooms = data;
      },
      error: (err) => console.error('Errore caricamento default:', err)
    });
  }

  search() {
    if (this.searchForm.invalid) {
      alert('Devi inserire Check-in e Check-out per cercare la disponibilità!');
      return;
    }

    console.log("Ricerca avviata con:", this.searchForm.value);

    const val = this.searchForm.value;
    const typesToSend = val.type ? [val.type] : [];

    this.roomService.searchRoomsAdvanced(
      val.checkin,
      val.checkout,
      typesToSend,
      val.maxPrice,
      val.minSize
    ).subscribe({
      next: (data) => {
        this.rooms = data;
        console.log("Risultati ricerca:", data);
        if (data.length === 0) alert("Nessuna stanza disponibile per queste date.");
      },
      error: (err) => console.error('Errore ricerca:', err)
    });
  }

  protected readonly RouterLink = RouterLink;
}
