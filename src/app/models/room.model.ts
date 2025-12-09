import {RoomState} from './enums/room-state.model';

export interface Room {
  number: number;
  name: string;
  price: number;
  size: number;
  maxGuests: number;
  state: RoomState;
  description: string;
}
