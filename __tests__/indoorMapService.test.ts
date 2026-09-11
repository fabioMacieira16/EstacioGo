jest.mock('../src/firebase/firestore', () => ({ db: {} }));

const mockDocs = jest.fn();

jest.mock('firebase/firestore', () => ({
  collection: jest.fn((_firestore, path) => ({ path })),
  doc: jest.fn((_firestore, path, id) => ({ path, id })),
  getDocs: jest.fn(async () => ({ docs: mockDocs() })),
  query: jest.fn((collectionRef, ...clauses) => ({ collectionRef, clauses })),
  setDoc: jest.fn(async () => undefined),
  where: jest.fn((field, op, value) => ({ field, op, value })),
}));

import { doc, setDoc } from 'firebase/firestore';

import { createIndoorMapService } from '../src/services/indoorMapService';
import type { IndoorMapDocument } from '../src/types/indoorMap';

const floorDocument = (overrides: Partial<IndoorMapDocument>): IndoorMapDocument => ({
  id: 'first-floor',
  campusId: 'campus-principal',
  buildingId: 'F',
  number: 1,
  label: '1º andar',
  width: 1000,
  height: 700,
  rooms: [],
  walls: [],
  doors: [],
  waypoints: [],
  active: true,
  ...overrides,
});

describe('indoorMapService', () => {
  beforeEach(() => {
    mockDocs.mockReset();
    (setDoc as jest.Mock).mockClear();
  });

  it('lists floors of a building ordered by floor number', async () => {
    mockDocs.mockReturnValue([
      { id: 'first-floor', data: () => floorDocument({ id: 'first-floor', number: 1 }) },
      { id: 'ground-floor', data: () => floorDocument({ id: 'ground-floor', number: 0, label: 'Térreo' }) },
    ]);

    const service = createIndoorMapService({ firestore: {} as never });
    const floors = await service.listFloorsByBuilding('F');

    expect(floors.map((floor) => floor.id)).toEqual(['ground-floor', 'first-floor']);
  });

  it('lists the distinct building ids with an active indoor map', async () => {
    mockDocs.mockReturnValue([
      { id: 'ground-floor', data: () => floorDocument({ buildingId: 'F' }) },
      { id: 'first-floor', data: () => floorDocument({ buildingId: 'F' }) },
    ]);

    const service = createIndoorMapService({ firestore: {} as never });
    const buildingIds = await service.listBuildingIds('campus-principal');

    expect(buildingIds).toEqual(['F']);
  });

  it('saves a floor document without duplicating the id field inside the data', async () => {
    const service = createIndoorMapService({ firestore: {} as never });
    await service.saveFloor(floorDocument({ id: 'ground-floor' }));

    expect(doc).toHaveBeenCalledWith({}, 'indoorMaps', 'ground-floor');
    const [, savedData] = (setDoc as jest.Mock).mock.calls[0];
    expect(savedData.id).toBeUndefined();
    expect(savedData.buildingId).toBe('F');
  });
});
