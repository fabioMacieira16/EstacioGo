import type { Coordinates } from '../types/coordinates';

export const DEFAULT_MAP_ORIGIN: Coordinates = {
  latitude: -3.766389,
  longitude: -38.574472,
};

export const DEFAULT_MAP_REGION = {
  ...DEFAULT_MAP_ORIGIN,
  latitudeDelta: 0.002,
  longitudeDelta: 0.002,
};
