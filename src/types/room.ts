import type { Coordinates } from './coordinates';

export type Room = {
  id: string;
  campusId: string;
  buildingId: string;
  floorId: string;
  code: string;
  name: string;
  destination: Coordinates;
  routeId: string | null;
  active: boolean;
};
