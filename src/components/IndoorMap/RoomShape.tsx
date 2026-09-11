import { G, Rect, Text as SvgText } from 'react-native-svg';

import type { MapRoom } from '../../types/indoorMap';

type RoomShapeProps = {
  room: MapRoom;
  selected: boolean;
  onPress: () => void;
};

export function RoomShape({ room, selected, onPress }: RoomShapeProps) {
  return (
    <G onPress={onPress}>
      <Rect
        x={room.position.x}
        y={room.position.y}
        width={room.width}
        height={room.height}
        fill={selected ? '#27566A' : '#633C3C'}
        stroke={selected ? '#49B7D1' : '#8B6662'}
        strokeWidth={selected ? 5 : 2}
        rx={2}
      />
      <SvgText
        x={room.position.x + room.width / 2}
        y={room.position.y + room.height / 2 - 5}
        fill="#F1E9D8"
        fontSize="22"
        fontWeight="800"
        textAnchor="middle"
      >
        {room.code}
      </SvgText>
      <SvgText
        x={room.position.x + room.width / 2}
        y={room.position.y + room.height / 2 + 23}
        fill="#D4C9B8"
        fontSize="14"
        textAnchor="middle"
      >
        {room.name}
      </SvgText>
    </G>
  );
}
