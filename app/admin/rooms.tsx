import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RoomForm } from '../../src/components/RoomForm';
import { DEFAULT_CAMPUS_ID, DEFAULT_MAP_ORIGIN } from '../../src/constants/map';
import { navigationTheme } from '../../src/constants/navigationTheme';
import { campusIndoorMap } from '../../src/constants/indoorMap';
import { initialRooms } from '../../src/constants/initialRooms';
import { useRooms } from '../../src/hooks/useRooms';
import { buildingService } from '../../src/services/buildingService';
import { indoorMapService } from '../../src/services/indoorMapService';
import { routeService } from '../../src/services/routeService';
import type { Room } from '../../src/types/room';

// Nomes de exibição para os blocos conhecidos. Blocos citados no letreiro da
// entrada mas ainda sem planta cadastrada (E, G, H) ficam com um nome
// genérico até que vídeos/fotos confirmem o conteúdo deles.
const BUILDING_LABELS: Record<string, string> = {
  A: 'Bloco Principal',
  D: 'Bloco D',
  E: 'Bloco E',
  F: 'Bloco F',
  G: 'Bloco G',
  H: 'Bloco H',
};

export default function AdminRoomsScreen() {
  const router = useRouter();
  const { rooms, loading, error, create, update, deactivate, remove } =
    useRooms();
  const [editing, setEditing] = useState<Room | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedingIndoor, setSeedingIndoor] = useState(false);
  const [seedIndoorError, setSeedIndoorError] = useState<string | null>(null);
  const inputFromRoom = (room: Room) => {
    const { id: _id, ...input } = room;
    return input;
  };

  async function seedCampusLocations() {
    setSeeding(true);
    try {
      const existingNames = new Set(
        rooms.map((room) => room.name.trim().toLowerCase()),
      );
      for (const room of initialRooms) {
        if (!existingNames.has(room.name.trim().toLowerCase())) {
          await create(room);
        }
      }
    } finally {
      setSeeding(false);
    }
  }

  async function seedIndoorDemo() {
    setSeedingIndoor(true);
    setSeedIndoorError(null);
    try {
      const existingBuildings = await buildingService.listBuildings(DEFAULT_CAMPUS_ID);
      const existingCodes = new Set(existingBuildings.map((building) => building.code));

      // Registra um Building para cada bloco que já tem planta cadastrada em
      // campusIndoorMap, mais os blocos citados no letreiro da entrada que
      // ainda não têm planta (ficam visíveis no seletor com estado vazio).
      const buildingCodesWithFloorPlan = new Set(
        campusIndoorMap.floors.map((floor) => floor.buildingId),
      );
      const allKnownBuildingCodes = new Set([
        ...buildingCodesWithFloorPlan,
        ...Object.keys(BUILDING_LABELS),
      ]);

      for (const code of allKnownBuildingCodes) {
        if (existingCodes.has(code)) continue;
        await buildingService.createBuilding({
          campusId: DEFAULT_CAMPUS_ID,
          code,
          name: BUILDING_LABELS[code] ?? `Bloco ${code}`,
          description: buildingCodesWithFloorPlan.has(code)
            ? 'Planta de demonstração (dados simulados).'
            : 'Bloco identificado na sinalização do campus; planta ainda não cadastrada.',
          active: true,
        });
      }

      for (const floor of campusIndoorMap.floors) {
        await indoorMapService.saveFloor({ ...floor, campusId: DEFAULT_CAMPUS_ID, active: true });
      }

      const demoRoute = campusIndoorMap.routes.f101;
      const f101 = rooms.find((room) => room.code === 'F101');
      if (demoRoute && f101 && !f101.routeId) {
        const routeId = await routeService.createRoute({
          campusId: DEFAULT_CAMPUS_ID,
          name: 'Entrada Principal → F101',
          origin: DEFAULT_MAP_ORIGIN,
          destination: DEFAULT_MAP_ORIGIN,
          coordinates: [DEFAULT_MAP_ORIGIN, DEFAULT_MAP_ORIGIN],
          indoor: demoRoute,
          active: true,
        });
        await update(f101.id, { ...inputFromRoom(f101), routeId });
      }
    } catch (error) {
      setSeedIndoorError(
        error instanceof Error ? error.message : 'Não foi possível cadastrar a planta.',
      );
    } finally {
      setSeedingIndoor(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.formCard}>
        <View style={styles.headerTopRow}>
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
        </View>

        <Text style={styles.eyebrow}>ADMINISTRAÇÃO</Text>
        <Text style={styles.title}>Gestão de salas</Text>

        <Pressable
          accessibilityRole="button"
          disabled={seeding}
          onPress={() => void seedCampusLocations()}
          style={[styles.seedButton, seeding && styles.disabledAction]}
        >
          <Text style={styles.seedButtonText}>
            {seeding ? 'Cadastrando locais...' : 'Cadastrar locais da planta'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={seedingIndoor}
          onPress={() => void seedIndoorDemo()}
          style={[styles.seedButton, seedingIndoor && styles.disabledAction]}
        >
          <Text style={styles.seedButtonText}>
            {seedingIndoor
              ? 'Cadastrando blocos e plantas...'
              : 'Cadastrar blocos e plantas indoor de demonstração'}
          </Text>
        </Pressable>
        {seedIndoorError ? <Text style={styles.error}>{seedIndoorError}</Text> : null}

        <RoomForm
          key={editing?.id ?? 'new'}
          initialValue={editing ? inputFromRoom(editing) : undefined}
          onSubmit={async (input) => {
            if (editing) await update(editing.id, input);
            else await create(input);
            setEditing(null);
          }}
        />
      </View>

      {loading ? <Text style={styles.status}>Carregando...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.listContainer}>
        {rooms.map((room) => (
          <View key={room.id} style={styles.roomCard}>
            <View style={styles.roomHeader}>
              <Text style={styles.roomCode}>{room.code}</Text>
              {!room.active ? (
                <Text style={styles.inactiveTag}>Desativada</Text>
              ) : null}
            </View>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomMeta}>
              Bloco {room.buildingId} • Andar {room.floor}
            </Text>

            <View style={styles.roomActions}>
              <Pressable
                onPress={() => setEditing(room)}
                style={styles.secondaryAction}
              >
                <Text style={styles.secondaryActionText}>Editar</Text>
              </Pressable>
              <Pressable
                onPress={() => void deactivate(room.id)}
                disabled={!room.active}
                style={[
                  styles.secondaryAction,
                  !room.active && styles.disabledAction,
                ]}
              >
                <Text style={styles.secondaryActionText}>Desativar</Text>
              </Pressable>
              <Pressable
                onPress={() => void remove(room.id)}
                style={styles.dangerAction}
              >
                <Text style={styles.dangerActionText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: navigationTheme.sidebarBackground,
    flex: 1,
  },
  screen: {
    gap: 18,
    padding: 20,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: navigationTheme.panelBackground,
    borderColor: navigationTheme.panelBorder,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    padding: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: navigationTheme.sidebarBackground,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backIcon: { color: navigationTheme.textPrimary, fontSize: 32, lineHeight: 36 },
  eyebrow: {
    color: navigationTheme.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: navigationTheme.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: navigationTheme.accent,
    borderRadius: 12,
    paddingVertical: 12,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: navigationTheme.textOnAccent,
    fontSize: 14,
    fontWeight: '700',
  },
  seedButton: {
    backgroundColor: navigationTheme.accentSoft,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  seedButtonText: { color: navigationTheme.accent, fontSize: 13, fontWeight: '800' },
  formCard: {
    backgroundColor: navigationTheme.panelBackground,
    borderColor: navigationTheme.panelBorder,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  status: {
    color: navigationTheme.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  roomCard: {
    backgroundColor: navigationTheme.panelBackground,
    borderColor: navigationTheme.panelBorder,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  roomHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomCode: {
    color: navigationTheme.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  inactiveTag: {
    backgroundColor: 'rgba(248, 113, 113, 0.16)',
    borderRadius: 999,
    color: '#F87171',
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roomName: {
    color: navigationTheme.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  roomMeta: {
    color: navigationTheme.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  roomActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  secondaryAction: {
    backgroundColor: navigationTheme.sidebarBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryActionText: {
    color: navigationTheme.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  disabledAction: {
    opacity: 0.5,
  },
  dangerAction: {
    backgroundColor: 'rgba(248, 113, 113, 0.16)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dangerActionText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '700',
  },
});
