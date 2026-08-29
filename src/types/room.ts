import type { Coordinates } from './coordinates';

export type RoomInput = {
  code: string;
  name: string;
  buildingId: string;
  floor: number;
  description: string;
  destination: Coordinates;
  routeId: string | null;
  active: boolean;
};

export type Room = {
  id: string;
} & RoomInput;
