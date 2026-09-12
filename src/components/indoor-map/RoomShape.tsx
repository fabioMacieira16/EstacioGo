import type { ComponentProps } from 'react';
import { Platform } from 'react-native';
import { G, Rect, Text as SvgText } from 'react-native-svg';

import type { MapRoom } from '../../types/indoorMap';

type RoomShapeProps = {
  room: MapRoom;
  selected: boolean;
  onPress: () => void;
};

export function RoomShape({ room, selected, onPress }: RoomShapeProps) {
  // react-native-svg emulates onPress on native using the legacy Touchable
  // responder system, which react-native-web doesn't consume correctly (it
  // logs "Unknown event handler property" for each responder prop). On web
  // the shape is real SVG DOM, so a plain onClick works natively instead.
  // react-native-svg's native and web type definitions don't share a prop
  // shape that accepts both, hence the cast.
  const pressProps = (
    Platform.OS === 'web' ? { onClick: onPress } : { onPress }
  ) as ComponentProps<typeof G>;

  return (
    <G {...pressProps}>
      {/* Soft drop shadow to lift the room off the floor, like the reference mock. */}
      <Rect
        x={room.position.x + 2}
        y={room.position.y + 3}
        width={room.width}
        height={room.height}
        fill="#0F172A"
        opacity={0.12}
        rx={4}
      />
      <Rect
        x={room.position.x}
        y={room.position.y}
        width={room.width}
        height={room.height}
        fill={selected ? 'url(#roomGradientSelected)' : 'url(#roomGradient)'}
        stroke={selected ? '#0D9488' : '#94A3B8'}
        strokeWidth={selected ? 3 : 1.5}
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
        fill="#334155"
        fontSize="14"
        textAnchor="middle"
      >
        {room.name}
      </SvgText>
    </G>
  );
}
