import { Polyline } from 'react-native-svg';

import type { MapCoordinate } from '../../types/indoorMap';

export function RouteLine({ points }: { points: MapCoordinate[] }) {
  return (
    <>
      <Polyline
        points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        fill="none"
        stroke="#1D4ED8"
        strokeWidth={20}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.25}
      />
      <Polyline
        points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        fill="none"
        stroke="#2563EB"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Thin highlight down the middle for a glossy, raised "pipe" look. */}
      <Polyline
        points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        fill="none"
        stroke="#93C5FD"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
    </>
  );
}
