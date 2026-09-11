import { Line } from 'react-native-svg';

import type { MapWall } from '../../types/indoorMap';

export function Wall({ wall }: { wall: MapWall }) {
  return (
    <Line
      x1={wall.start.x}
      y1={wall.start.y}
      x2={wall.end.x}
      y2={wall.end.y}
      stroke="#0B0D10"
      strokeWidth={14}
      strokeLinecap="square"
    />
  );
}
