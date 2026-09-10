import {
  calculateIndoorDistance,
  formatIndoorDistance,
} from '../src/utils/indoorDistance';

describe('indoor distance', () => {
  it('calculates distance from ordered map points', () => {
    expect(calculateIndoorDistance([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ])).toBeCloseTo(90);
  });

  it('formats internal distances in meters', () => {
    expect(formatIndoorDistance(86.4)).toBe('86 m');
  });
});