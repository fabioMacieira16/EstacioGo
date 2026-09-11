import { useCallback, useEffect, useState } from 'react';

import { recentRoomsService, type RecentRoomEntry } from '../services/recentRoomsService';

export function useRecentRooms() {
  const [recentRooms, setRecentRooms] = useState<RecentRoomEntry[]>([]);

  useEffect(() => {
    // Restore recent rooms saved on this device from a previous visit.
    void recentRoomsService.list().then(setRecentRooms);
  }, []);

  const registerVisit = useCallback(async (entry: RecentRoomEntry) => {
    setRecentRooms(await recentRoomsService.add(entry));
  }, []);

  return { recentRooms, registerVisit };
}
