import type { Coordinates } from './coordinates';
import type { Timestamp } from 'firebase/firestore';

export type RouteInput = {
  campusId: string;
  name: string;
  origin: Coordinates;
  destination: Coordinates;
  coordinates: Coordinates[];
  active: boolean;
};

export type Route = RouteInput & {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
