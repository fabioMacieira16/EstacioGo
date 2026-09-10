import { Polyline } from 'react-native-svg';

import type { MapCoordinate } from '../../types/indoorMap';

export function RouteLine({ points }: { points: MapCoordinate[] }) {
  return (
    <>
      <Polyline
        points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        fill="none"
        stroke="#2563EB"
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}
