jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import AsyncStorage from '@react-native-async-storage/async-storage';

import { recentRoomsService } from '../src/services/recentRoomsService';

describe('recentRoomsService', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts empty when nothing was visited yet', async () => {
    expect(await recentRoomsService.list()).toEqual([]);
  });

  it('adds the most recently visited room to the front of the list', async () => {
    await recentRoomsService.add({ id: '1', code: 'F101', name: 'Sala F101' });
    const result = await recentRoomsService.add({ id: '2', code: 'F102', name: 'Sala F102' });

    expect(result.map((room) => room.code)).toEqual(['F102', 'F101']);
  });

  it('moves a room already in the list back to the front instead of duplicating it', async () => {
    await recentRoomsService.add({ id: '1', code: 'F101', name: 'Sala F101' });
    await recentRoomsService.add({ id: '2', code: 'F102', name: 'Sala F102' });
    const result = await recentRoomsService.add({ id: '1', code: 'F101', name: 'Sala F101' });

    expect(result.map((room) => room.id)).toEqual(['1', '2']);
  });

  it('keeps only the 5 most recent rooms', async () => {
    for (let index = 0; index < 7; index += 1) {
      await recentRoomsService.add({ id: String(index), code: `R${index}`, name: `Sala ${index}` });
    }
    const result = await recentRoomsService.list();

    expect(result).toHaveLength(5);
    expect(result[0].id).toBe('6');
  });
});
