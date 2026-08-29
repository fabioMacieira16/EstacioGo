import { useState } from 'react';

import { roomService } from '../services/roomService';
import type { Room } from '../types/room';

export function useRoomSearch() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(term: string) {
    setLoading(true);
    setError(null);
    try {
      setRooms(await roomService.searchRooms(term));
    } catch {
      setRooms([]);
      setError('Não foi possível carregar as salas.');
    } finally {
      setLoading(false);
    }
  }

  return { rooms, loading, error, search };
}
