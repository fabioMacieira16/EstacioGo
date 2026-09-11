import { Line } from 'react-native-svg';

import type { MapDoor } from '../../types/indoorMap';

export function Door({ door }: { door: MapDoor }) {
  const horizontal = door.orientation === 'horizontal';
  return (
    <Line
      x1={door.position.x - (horizontal ? 22 : 0)}
      y1={door.position.y - (horizontal ? 0 : 22)}
      x2={door.position.x + (horizontal ? 22 : 0)}
      y2={door.position.y + (horizontal ? 0 : 22)}
      stroke="#8B9498"
      strokeWidth={12}
    />
  );
}
