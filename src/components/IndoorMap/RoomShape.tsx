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
        fill={selected ? '#DBEAFE' : '#FFFFFF'}
        stroke={selected ? '#2563EB' : '#94A3B8'}
        strokeWidth={selected ? 5 : 3}
        rx={4}
      />
      <SvgText
        x={room.position.x + room.width / 2}
        y={room.position.y + room.height / 2 - 5}
        fill="#0F172A"
        fontSize="22"
        fontWeight="800"
        textAnchor="middle"
      >
        {room.code}
      </SvgText>
      <SvgText
        x={room.position.x + room.width / 2}
        y={room.position.y + room.height / 2 + 23}
        fill="#475569"
        fontSize="14"
        textAnchor="middle"
      >
        {room.name}
      </SvgText>
    </G>
  );
}
