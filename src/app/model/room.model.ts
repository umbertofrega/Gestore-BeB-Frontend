import { RoomType } from './enums/room-types.model';
import { RoomState } from './enums/room-types.model';

export interface Room {
  number: number;
  type: RoomType;
  name: string;
  price: number;
  size: number;
  state: RoomState;
  description: string;
}
