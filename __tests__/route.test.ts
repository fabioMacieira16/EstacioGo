import { validateRouteInput } from '../src/utils/route';
import type { RouteInput } from '../src/types/route';

const validRoute: RouteInput = {
  campusId: 'campus-principal',
  name: 'Entrada para F101',
  origin: { latitude: -3, longitude: -38.5 },
  destination: { latitude: -3.0001, longitude: -38.5001 },
  coordinates: [
    { latitude: -3, longitude: -38.5 },
    { latitude: -3.0001, longitude: -38.5001 },
  ],
  active: true,
};

describe('route rules', () => {
  it('accepts a route with ordered coordinates', () => {
    expect(() => validateRouteInput(validRoute)).not.toThrow();
  });

  it('requires at least two valid points', () => {
    expect(() =>
      validateRouteInput({ ...validRoute, coordinates: [validRoute.origin] }),
    ).toThrow();
    expect(() =>
      validateRouteInput({
        ...validRoute,
        coordinates: [validRoute.origin, { latitude: 91, longitude: 0 }],
      }),
    ).toThrow();
  });

  it('rejects coordinates outside geographic bounds', () => {
    expect(() =>
      validateRouteInput({
        ...validRoute,
        coordinates: [validRoute.origin, { latitude: 91, longitude: 0 }],
      }),
    ).toThrow();
  });
});
