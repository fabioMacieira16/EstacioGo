import type { Coordinates } from '../types/coordinates';

const EARTH_RADIUS_METERS = 6_371_000;

export function calculateDistanceMeters(
  from: Coordinates,
  to: Coordinates,
): number {
  const latitudeDelta = ((to.latitude - from.latitude) * Math.PI) / 180;
  const longitudeDelta = ((to.longitude - from.longitude) * Math.PI) / 180;
  const fromLatitude = (from.latitude * Math.PI) / 180;
  const toLatitude = (to.latitude * Math.PI) / 180;
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine));
}

export function formatDistance(meters: number): string {
  return meters < 1000
    ? `${Math.round(meters)} m de distância`
    : `${(meters / 1000).toFixed(1)} km de distância`;
}

export function calculateRouteDistance(coordinates: Coordinates[]): number {
  return coordinates.reduce(
    (total, coordinate, index) =>
      index === 0
        ? total
        : total + calculateDistanceMeters(coordinates[index - 1], coordinate),
    0,
  );
}
