// src/app/models/room-type.model.ts

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
  FAMILY = 'FAMILY',
  SUITE = 'SUITE',
}

export enum RoomState {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  OCCUPIED = "OCCUPIED",
  HIDDEN = "HIDDEN"
}
