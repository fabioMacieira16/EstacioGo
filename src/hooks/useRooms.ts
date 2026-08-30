import { useCallback, useEffect, useState } from 'react';

import { roomService } from '../services/roomService';
import type { Room, RoomInput } from '../types/room';

export function useRooms(includeInactive = true) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRooms(await roomService.listRooms(includeInactive));
    } catch {
      setError('Não foi possível carregar as salas.');
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    // The service result is external data synchronized into the hook state.
    void reload();
  }, [reload]);

  async function create(input: RoomInput) {
    await roomService.createRoom(input);
    await reload();
  }

  async function update(id: string, input: RoomInput) {
    await roomService.updateRoom(id, input);
    await reload();
  }

  async function deactivate(id: string) {
    await roomService.deactivateRoom(id);
    await reload();
  }

  async function remove(id: string) {
    await roomService.deleteRoom(id);
    await reload();
  }

  return { rooms, loading, error, reload, create, update, deactivate, remove };
}
