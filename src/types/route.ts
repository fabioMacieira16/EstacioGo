import type { Coordinates } from './coordinates';

export type Route = {
  id: string;
  campusId: string;
  name: string;
  origin: Coordinates;
  destination: Coordinates;
  coordinates: Coordinates[];
  active: boolean;
};
