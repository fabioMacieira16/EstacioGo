import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { BuildingSelector } from '../../src/components/sidebar/BuildingSelector';
import { FloorSelector } from '../../src/components/sidebar/FloorSelector';
import { RecentRooms } from '../../src/components/sidebar/RecentRooms';
import { SearchRoom } from '../../src/components/sidebar/SearchRoom';
import { SidebarPanel, SIDEBAR_BREAKPOINT } from '../../src/components/sidebar/SidebarPanel';
import { IndoorMap } from '../../src/components/indoor-map/IndoorMap';
import { MapLegend } from '../../src/components/indoor-map/MapLegend';
import { DistanceCard } from '../../src/components/navigation/DistanceCard';
import { NavigationHeader } from '../../src/components/navigation/NavigationHeader';
import { NavigationSummary } from '../../src/components/navigation/NavigationSummary';
import { useIndoorNavigation } from '../../src/hooks/useIndoorNavigation';
import { useRecentRooms } from '../../src/hooks/useRecentRooms';
import { useRoute } from '../../src/hooks/useRoute';
import { formatIndoorDistance } from '../../src/utils/indoorDistance';

export default function NavigationScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, route, loading, error } = useRoute(roomId);
  const { registerVisit, recentRooms } = useRecentRooms();
  const {
    buildings,
    selectedBuildingId,
    setSelectedBuildingId,
    floors,
    selectedFloorId,
    setSelectedFloorId,
    indoorRoute,
    hasFloorPlan,
  } = useIndoorNavigation(room, route);
  const { width } = useWindowDimensions();
  const isWide = width >= SIDEBAR_BREAKPOINT;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!room) return;
    void registerVisit({ id: room.id, code: room.code, name: room.name });
    // Only register once per room load, not on every recentRooms/registerVisit re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id]);

  if (loading) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator color="#0F766E" size="large" />
      </View>
    );
  }

  if (error || !room) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.errorTitle}>{error ?? 'Sala não encontrada.'}</Text>
      </View>
    );
  }

  const selectedBuilding = buildings.find((building) => building.code === selectedBuildingId);
  const currentFloor = floors.find((floor) => floor.id === selectedFloorId);
  const originFloor = floors.find((floor) => floor.id === indoorRoute?.originFloorId);
  const originWaypoint = originFloor?.waypoints.find((waypoint) => waypoint.type === 'entrance');

  function goToRoom(nextRoomId: string) {
    setSidebarOpen(false);
    router.replace(`/route/${nextRoomId}`);
  }

  const sidebarContent = (
    <>
      <View style={styles.brand}>
        <Text style={styles.brandTitle}>Campus Route</Text>
        <Text style={styles.brandSubtitle}>Encontre seu caminho.</Text>
      </View>
      <SearchRoom onSelect={(selected) => goToRoom(selected.id)} />
      <RecentRooms
        rooms={recentRooms}
        onSelect={(selected) => goToRoom(selected.id)}
      />
      <BuildingSelector
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onSelect={setSelectedBuildingId}
      />
      <FloorSelector
        floors={floors}
        selectedFloorId={selectedFloorId ?? ''}
        onSelect={setSelectedFloorId}
      />
    </>
  );

  return (
    <View style={styles.screen}>
      <SidebarPanel visible={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        {sidebarContent}
      </SidebarPanel>

      <ScrollView contentContainerStyle={styles.main}>
        <NavigationHeader
          roomName={room.name}
          buildingLabel={selectedBuilding ? `Bloco ${selectedBuilding.code}` : undefined}
          floorLabel={currentFloor?.label}
          onBack={() => router.back()}
          onOpenSidebar={isWide ? undefined : () => setSidebarOpen(true)}
        />

        {!room.routeId || !indoorRoute ? (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Rota ainda não disponível</Text>
            <Text style={styles.noticeText}>
              Esta sala ainda não possui uma rota cadastrada até a entrada do campus.
            </Text>
          </View>
        ) : !hasFloorPlan ? (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>
              Planta do {selectedBuilding ? selectedBuilding.name : 'bloco'} ainda não cadastrada
            </Text>
            <Text style={styles.noticeText}>
              A planta digital desse bloco ainda não foi cadastrada nesta demonstração.
            </Text>
          </View>
        ) : (
          <>
            <DistanceCard
              distanceLabel={formatIndoorDistance(indoorRoute.distanceMeters)}
              timeLabel={
                indoorRoute.estimatedTimeMinutes !== undefined
                  ? `${indoorRoute.estimatedTimeMinutes} min`
                  : undefined
              }
            />

            <IndoorMap
              floors={floors}
              selectedFloorId={selectedFloorId ?? floors[0].id}
              onSelectFloor={setSelectedFloorId}
              route={indoorRoute}
              destinationRoomCode={room.code}
              destinationRoomName={room.name}
            />

            <NavigationSummary
              originLabel={originWaypoint?.label ?? 'Entrada Principal'}
              destinationLabel={room.name}
              distanceLabel={formatIndoorDistance(indoorRoute.distanceMeters)}
              timeLabel={
                indoorRoute.estimatedTimeMinutes !== undefined
                  ? `${indoorRoute.estimatedTimeMinutes} min`
                  : undefined
              }
            />

            <MapLegend />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F8FAFC', flex: 1, flexDirection: 'row' },
  main: { flex: 1, gap: 14, padding: 16 },
  centeredState: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: { color: '#0F172A', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  brand: { gap: 2 },
  brandTitle: { color: '#0F172A', fontSize: 20, fontWeight: '800' },
  brandSubtitle: { color: '#64748B', fontSize: 13 },
  noticeCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    padding: 18,
  },
  noticeTitle: { color: '#92400E', fontSize: 15, fontWeight: '800' },
  noticeText: { color: '#B45309', fontSize: 13, lineHeight: 19 },
});
