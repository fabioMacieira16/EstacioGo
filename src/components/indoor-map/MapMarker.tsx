import { Circle, G, Text as SvgText } from 'react-native-svg';

import type { MapCoordinate } from '../../types/indoorMap';

type MapMarkerProps = {
  position: MapCoordinate;
  label: string;
  color: string;
};

export function MapMarker({ position, label, color }: MapMarkerProps) {
  return (
    <G>
      <Circle cx={position.x} cy={position.y} r={19} fill="#FFFFFF" stroke={color} strokeWidth={2} opacity={0.45} />
      <Circle cx={position.x} cy={position.y} r={13} fill="#FFFFFF" stroke={color} strokeWidth={3} />
      <Circle cx={position.x} cy={position.y} r={6} fill={color} />
      <SvgText
        x={position.x}
        y={position.y - 27}
        fill="#1E293B"
        fontSize="15"
        fontWeight="800"
        textAnchor="middle"
      >
        {label}
      </SvgText>
    </G>
  );
}
