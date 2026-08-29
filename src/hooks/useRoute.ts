import { useEffect, useState } from 'react';

import { roomService } from '../services/roomService';
import { routeService } from '../services/routeService';
import type { Room } from '../types/room';
import type { Route } from '../types/route';

export function useRoute(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void roomService.getRoomById(roomId).then(async (result) => {
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
