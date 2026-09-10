import type { MapCoordinate } from '../types/indoorMap';

const MAP_UNIT_METERS = 0.45;

export function calculateIndoorDistance(points: MapCoordinate[]): number {
  return points.reduce((total, point, index) => {
    if (index === 0) return total;
    const previous = points[index - 1];
    return total + Math.hypot(point.x - previous.x, point.y - previous.y) * MAP_UNIT_METERS;
  }, 0);
}

export function formatIndoorDistance(meters: number): string {
  return `${Math.round(meters)} m`;
}
