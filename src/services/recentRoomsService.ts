import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'campus-route:recent-rooms';
const MAX_ENTRIES = 5;

export type RecentRoomEntry = {
  id: string;
  code: string;
  name: string;
};

async function readEntries(): Promise<RecentRoomEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentRoomEntry[]) : [];
  } catch {
    return [];
  }
}

export const recentRoomsService = {
  async list(): Promise<RecentRoomEntry[]> {
    return readEntries();
  },

  async add(entry: RecentRoomEntry): Promise<RecentRoomEntry[]> {
    const current = await readEntries();
    const withoutDuplicate = current.filter((item) => item.id !== entry.id);
    const updated = [entry, ...withoutDuplicate].slice(0, MAX_ENTRIES);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
