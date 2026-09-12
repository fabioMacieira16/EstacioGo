import { Line, Rect } from 'react-native-svg';

import type { MapWall } from '../../types/indoorMap';

const THICKNESS = 12;

export function Wall({ wall }: { wall: MapWall }) {
  const isHorizontal = wall.start.y === wall.end.y;
  const isVertical = wall.start.x === wall.end.x;

  // All current wall data is axis-aligned. Render those as a thick rect with
  // a gradient fill to fake a lit, extruded 3D wall face. Fall back to a
  // plain line for the (currently unused) diagonal case, just in case.
  if (isHorizontal) {
    const x = Math.min(wall.start.x, wall.end.x);
    const width = Math.abs(wall.end.x - wall.start.x);
    return (
      <Rect
        x={x}
        y={wall.start.y - THICKNESS / 2}
        width={width}
        height={THICKNESS}
        fill="url(#wallGradientH)"
        rx={1.5}
      />
    );
  }

  if (isVertical) {
    const y = Math.min(wall.start.y, wall.end.y);
    const height = Math.abs(wall.end.y - wall.start.y);
    return (
      <Rect
        x={wall.start.x - THICKNESS / 2}
        y={y}
        width={THICKNESS}
        height={height}
        fill="url(#wallGradientV)"
        rx={1.5}
      />
    );
  }

  return (
    <Line
      x1={wall.start.x}
      y1={wall.start.y}
      x2={wall.end.x}
      y2={wall.end.y}
      stroke="#64748B"
      strokeWidth={THICKNESS}
      strokeLinecap="square"
    />
  );
}
