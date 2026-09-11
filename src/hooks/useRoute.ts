import { useEffect, useState } from 'react';

import { roomService } from '../services/roomService';
import { routeService } from '../services/routeService';
import type { Room } from '../types/room';
import type { Route } from '../types/route';

export function useRoute(roomId: string | undefined) {
  const [room, setRoom] = useState<Room | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(Boolean(roomId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      // No room selected (idle state): clear whatever the previous roomId loaded.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoom(null);
      setRoute(null);
      setError(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);
    void roomService
      .getRoomById(roomId)
      .then(async (result) => {
        if (mounted) setRoom(result);
        if (result?.routeId) {
          const routeResult = await routeService.getRouteById(result.routeId);
          if (mounted) setRoute(routeResult);
        } else if (mounted) {
          setRoute(null);
        }
      })
      .catch(() => {
        if (mounted) setError('Não foi possível carregar a sala.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [roomId]);

  return { room, route, loading, error };
}
