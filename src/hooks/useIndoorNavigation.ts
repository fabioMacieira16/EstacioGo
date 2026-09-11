import { useEffect, useState } from 'react';

import { DEFAULT_CAMPUS_ID } from '../constants/map';
import { buildingService } from '../services/buildingService';
import { indoorMapService } from '../services/indoorMapService';
import type { Building } from '../types/building';
import type { IndoorFloor, IndoorRoute } from '../types/indoorMap';
import type { Room } from '../types/room';
import type { Route } from '../types/route';

export function useIndoorNavigation(room: Room | null, route: Route | null) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [floors, setFloors] = useState<IndoorFloor[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void buildingService
      .listBuildings(DEFAULT_CAMPUS_ID)
      .then((result) => {
        if (mounted) setBuildings(result);
      })
      .catch(() => {
        if (mounted) setError('Não foi possível carregar os blocos do campus.');
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (room) {
      // Follow the searched room's block automatically, matching the totem UX.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedBuildingId(room.buildingId);
      return;
    }
    if (!selectedBuildingId && buildings.length > 0) {
      // Idle state (no room searched yet): default to the first available
      // block so the totem layout (blocks, floors, map) is visible right away.
      setSelectedBuildingId(buildings[0].code);
    }
  }, [room, buildings, selectedBuildingId]);

  useEffect(() => {
    if (!selectedBuildingId) {
      // No block selected yet (or the room's block has no data): clear the floor list.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFloors([]);
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);
    void indoorMapService
      .listFloorsByBuilding(selectedBuildingId)
      .then((result) => {
        if (mounted) setFloors(result);
      })
      .catch(() => {
        if (mounted) setError('Não foi possível carregar a planta do bloco.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [selectedBuildingId]);

  const indoorRoute: IndoorRoute | null = route?.indoor ?? null;

  useEffect(() => {
    // Land on the route's destination floor (or the room's own floor number)
    // instead of always defaulting to the first floor of the block.
    if (floors.length === 0) return;
    const targetFloor =
      floors.find((floor) => floor.id === indoorRoute?.destinationFloorId) ??
      floors.find((floor) => floor.number === room?.floor) ??
      floors[0];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedFloorId(targetFloor.id);
  }, [floors, indoorRoute, room]);

  const currentFloor = floors.find((floor) => floor.id === selectedFloorId) ?? null;

  return {
    buildings,
    selectedBuildingId,
    setSelectedBuildingId,
    floors,
    selectedFloorId,
    setSelectedFloorId,
    currentFloor,
    indoorRoute,
    hasFloorPlan: floors.length > 0,
    loading,
    error,
  };
}
