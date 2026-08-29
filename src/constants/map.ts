import type { Coordinates } from '../types/coordinates';

export const DEFAULT_MAP_ORIGIN: Coordinates = {
  latitude: -3.000001,
  longitude: -38.500001,
};

export const DEFAULT_MAP_REGION = {
  ...DEFAULT_MAP_ORIGIN,
  latitudeDelta: 0.002,
  longitudeDelta: 0.002,
};
