import {
  matchesRoomSearch,
  normalizeRoomCode,
  validateRoomInput,
} from '../src/utils/roomCode';
import type { RoomInput } from '../src/types/room';

const validRoom: RoomInput = {
  code: 'F101',
  name: 'Sala F101',
  buildingId: 'bloco-f',
  floor: 1,
  description: 'Sala de aula',
  destination: { latitude: -3, longitude: -38.5 },
  routeId: 'route-f101',
  active: true,
};

describe('room rules', () => {
  it('normalizes a room code', () => {
    expect(normalizeRoomCode(' f101 ')).toBe('F101');
  });

  it('accepts a complete room', () => {
    expect(() => validateRoomInput(validRoom)).not.toThrow();
  });

  it('rejects an incomplete room', () => {
    expect(() => validateRoomInput({ ...validRoom, code: ' ' })).toThrow();
    expect(() => validateRoomInput({ ...validRoom, floor: 1.5 })).toThrow();
    expect(() =>
      validateRoomInput({
        ...validRoom,
        destination: { latitude: NaN, longitude: -38.5 },
      }),
    ).toThrow();
    expect(() =>
      validateRoomInput({
        ...validRoom,
        destination: { latitude: 91, longitude: -38.5 },
      }),
    ).toThrow();
  });

  it('searches by code or name case-insensitively', () => {
    expect(matchesRoomSearch('F101', 'Laboratório de Física', 'f10')).toBe(
      true,
    );
    expect(matchesRoomSearch('F101', 'Laboratório de Física', 'fisica')).toBe(
      true,
    );
    expect(
      matchesRoomSearch('F101', 'Laboratório de Física', 'auditorio'),
    ).toBe(false);
    expect(matchesRoomSearch('F101', 'Laboratório de Física', ' ')).toBe(false);
  });
});
