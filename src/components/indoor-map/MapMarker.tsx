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
      <Circle cx={position.x} cy={position.y} r={18} fill="#171A1E" stroke="#D9D1C2" strokeWidth={3} />
      <Circle cx={position.x} cy={position.y} r={13} fill={color} />
      <SvgText
        x={position.x}
        y={position.y - 27}
        fill="#F1E9D8"
        fontSize="16"
        fontWeight="800"
        textAnchor="middle"
      >
        {label}
      </SvgText>
    </G>
  );
}
