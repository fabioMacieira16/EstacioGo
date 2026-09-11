import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { BuildingSelector } from '../components/sidebar/BuildingSelector';
import { FloorSelector } from '../components/sidebar/FloorSelector';
import { RecentRooms } from '../components/sidebar/RecentRooms';
import { SearchRoom } from '../components/sidebar/SearchRoom';
import { SidebarPanel, SIDEBAR_BREAKPOINT } from '../components/sidebar/SidebarPanel';
import { IndoorMap } from '../components/indoor-map/IndoorMap';
import { MapLegend } from '../components/indoor-map/MapLegend';
import { DistanceCard } from '../components/navigation/DistanceCard';
import { NavigationHeader } from '../components/navigation/NavigationHeader';
import { NavigationSummary } from '../components/navigation/NavigationSummary';
import { navigationTheme } from '../constants/navigationTheme';
import { useAuth } from '../hooks/useAuth';
import { useIndoorNavigation } from '../hooks/useIndoorNavigation';
import { useRecentRooms } from '../hooks/useRecentRooms';
import { useRoute } from '../hooks/useRoute';
import { formatIndoorDistance } from '../utils/indoorDistance';

type NavigationScreenProps = {
  roomId: string | undefined;
  onSelectRoom: (roomId: string) => void;
  onOpenAdmin?: () => void;
  onBack?: () => void;
};

export function NavigationScreen({ roomId, onSelectRoom, onOpenAdmin, onBack }: NavigationScreenProps) {
  const { user, logout } = useAuth();
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

  const selectedBuilding = buildings.find((building) => building.code === selectedBuildingId);
  const currentFloor = floors.find((floor) => floor.id === selectedFloorId);
  const originFloor = floors.find((floor) => floor.id === indoorRoute?.originFloorId);
  const originWaypoint = originFloor?.waypoints.find((waypoint) => waypoint.type === 'entrance');
  const userName = user?.email?.split('@')[0] ?? 'Aluno';
  const userRoleLabel = user?.role === 'ADMIN' ? 'Administrador' : 'Aluno';

  function selectRoom(nextRoomId: string) {
    setSidebarOpen(false);
    onSelectRoom(nextRoomId);
  }

  const sidebarContent = (
    <>
      <View style={styles.brand}>
        <Text style={styles.brandPin}>📍</Text>
        <View>
          <Text style={styles.brandTitle}>
            Campus <Text style={styles.brandTitleAccent}>Route</Text>
          </Text>
          <Text style={styles.brandSubtitle}>Encontre seu caminho.</Text>
        </View>
      </View>

      <View style={styles.accountRow}>
        <View style={styles.accountCopy}>
          <Text style={styles.accountName} numberOfLines={1}>
            Olá, {userName}
          </Text>
          <Text style={styles.accountRole}>{userRoleLabel}</Text>
        </View>
        <View style={styles.accountActions}>
          {onOpenAdmin ? (
            <Pressable
              accessibilityRole="button"
              onPress={onOpenAdmin}
              style={({ pressed }) => [styles.accountButton, pressed && styles.accountButtonPressed]}
            >
              <Text style={styles.accountButtonText}>Administrar</Text>
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => void logout()}
            style={({ pressed }) => [styles.accountButton, pressed && styles.accountButtonPressed]}
          >
            <Text style={styles.accountButtonText}>Sair</Text>
          </Pressable>
        </View>
      </View>

      <SearchRoom onSelect={(selected) => selectRoom(selected.id)} />
      <RecentRooms rooms={recentRooms} onSelect={(selected) => selectRoom(selected.id)} />
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

  function renderMain() {
    if (roomId && loading) {
      return (
        <View style={styles.centeredState}>
          <ActivityIndicator color={navigationTheme.accent} size="large" />
        </View>
      );
    }

    if (roomId && (error || !room)) {
      return (
        <View style={styles.centeredState}>
          <Text style={styles.errorTitle}>{error ?? 'Sala não encontrada.'}</Text>
        </View>
      );
    }

    // With a room selected this shows its navigation info; while idle (no room
    // searched yet) it still shows the same layout — header, map and legend —
    // browsing the currently selected block instead of a blank placeholder.
    return (
      <>
        <View style={[styles.headerRow, isWide && styles.headerRowWide]}>
          <View style={isWide ? styles.headerFlex : undefined}>
            <NavigationHeader
              roomName={room?.name ?? 'Explore o mapa'}
              buildingLabel={selectedBuilding ? `Bloco ${selectedBuilding.code}` : undefined}
              floorLabel={currentFloor?.label}
              onBack={room ? onBack : undefined}
              onOpenSidebar={isWide ? undefined : () => setSidebarOpen(true)}
            />
          </View>

          {room && indoorRoute && hasFloorPlan ? (
            <View style={isWide ? styles.headerDistance : undefined}>
              <DistanceCard
                distanceLabel={formatIndoorDistance(indoorRoute.distanceMeters)}
                timeLabel={
                  indoorRoute.estimatedTimeMinutes !== undefined
                    ? `${indoorRoute.estimatedTimeMinutes} min`
                    : undefined
                }
              />
            </View>
          ) : null}
        </View>

        {room?.description ? <Text style={styles.description}>{room.description}</Text> : null}

        {room && (!room.routeId || !indoorRoute) ? (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Rota ainda não disponível</Text>
            <Text style={styles.noticeText}>
              Esta sala ainda não possui uma rota cadastrada até a entrada do campus.
            </Text>
          </View>
        ) : !hasFloorPlan ? (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>
              {selectedBuilding
                ? `Planta do ${selectedBuilding.name} ainda não cadastrada`
                : 'Nenhuma planta cadastrada ainda'}
            </Text>
            <Text style={styles.noticeText}>
              {room
                ? 'A planta digital desse bloco ainda não foi cadastrada nesta demonstração.'
                : 'Pesquise uma sala ou peça a um administrador para cadastrar a planta de um bloco.'}
            </Text>
          </View>
        ) : (
          <>
            <IndoorMap
              floors={floors}
              selectedFloorId={selectedFloorId ?? floors[0].id}
              onSelectFloor={setSelectedFloorId}
              route={indoorRoute}
              destinationRoomCode={room?.code ?? ''}
              destinationRoomName={room?.name}
            />

            {room && indoorRoute ? (
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
            ) : null}

            <MapLegend />
          </>
        )}
      </>
    );
  }

  return (
    <View style={styles.screen}>
      <SidebarPanel visible={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        {sidebarContent}
      </SidebarPanel>

      <ScrollView contentContainerStyle={styles.main}>{renderMain()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F8FAFC', flex: 1, flexDirection: 'row' },
  main: { flex: 1, flexGrow: 1, gap: 14, padding: 16 },
  centeredState: {
    alignItems: 'center',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    minHeight: 420,
    padding: 24,
  },
  errorTitle: { color: '#0F172A', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  description: { color: '#475569', fontSize: 13, lineHeight: 19, marginTop: -6 },
  headerRow: { gap: 14 },
  headerRowWide: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  headerFlex: { flexGrow: 1, flexShrink: 1, minWidth: 260 },
  headerDistance: { flexShrink: 0, width: 240 },
  brand: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  brandPin: { fontSize: 22 },
  brandTitle: { color: navigationTheme.textPrimary, fontSize: 19, fontWeight: '800' },
  brandTitleAccent: { color: navigationTheme.accent },
  brandSubtitle: { color: navigationTheme.textSecondary, fontSize: 12 },
  accountRow: {
    alignItems: 'center',
    backgroundColor: navigationTheme.panelBackground,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  accountCopy: { flex: 1, gap: 2, marginRight: 8 },
  accountName: { color: navigationTheme.textPrimary, fontSize: 13, fontWeight: '700' },
  accountRole: { color: navigationTheme.textSecondary, fontSize: 11 },
  accountActions: { flexDirection: 'row', gap: 6 },
  accountButton: {
    backgroundColor: navigationTheme.sidebarBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  accountButtonPressed: { opacity: 0.8 },
  accountButtonText: { color: navigationTheme.accent, fontSize: 11, fontWeight: '800' },
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
