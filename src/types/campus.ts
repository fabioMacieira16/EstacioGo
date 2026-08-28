import type { Coordinates } from './coordinates';

export type Campus = {
  id: string;
  name: string;
  defaultOrigin: Coordinates;
  active: boolean;
};
