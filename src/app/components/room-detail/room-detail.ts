import {Component, inject, OnInit} from '@angular/core';
import {Room} from '../../models/room.model';
import {RoomService} from '../../services/room.service';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-room-detail',
  imports: [],
  templateUrl: './room-detail.html',
  styleUrl: './room-detail.css',
})
export class RoomDetail implements OnInit{

  room : Room | null  = null;
  roomService : RoomService = inject(RoomService);

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  async ngOnInit() {
    const number = this.route.snapshot.paramMap.get('number');
    if (number)
      this.loadRoomDetail(number)

  }

  loadRoomDetail(roomNumber : String) {
    this.roomService.getRoom(+roomNumber).subscribe({
          next: (data) => {
            this.room = data;
        },
        error: (err) => console.error('Errore nella stanza passata:', err)
      },
    );
  }
}
