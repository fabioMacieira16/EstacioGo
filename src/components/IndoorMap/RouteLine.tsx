import { Polyline } from 'react-native-svg';

import type { MapCoordinate } from '../../types/indoorMap';

export function RouteLine({ points }: { points: MapCoordinate[] }) {
  return (
    <>
      <Polyline
        points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        fill="none"
        stroke="#071317"
        strokeWidth={24}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        fill="none"
        stroke="#42B8D2"
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}
