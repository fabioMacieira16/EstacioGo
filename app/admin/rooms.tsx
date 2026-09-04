import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { RoomForm } from '../../src/components/RoomForm';
import { useRooms } from '../../src/hooks/useRooms';
import type { Room } from '../../src/types/room';

export default function AdminRoomsScreen() {
  const router = useRouter();
  const { rooms, loading, error, create, update, deactivate, remove } =
    useRooms();
  const [editing, setEditing] = useState<Room | null>(null);
  const inputFromRoom = (room: Room) => {
    const { id: _id, ...input } = room;
    return input;
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.eyebrow}>ADMINISTRAÇÃO</Text>
          <Text style={styles.title}>Gestão de salas</Text>
        </View>
        <Pressable
          onPress={() => router.push('/admin/routes')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>Abrir editor de rotas</Text>
        </Pressable>
      </View>

      <View style={styles.formCard}>
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
              {!room.active ? <Text style={styles.inactiveTag}>Desativada</Text> : null}
            </View>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomMeta}>Bloco {room.buildingId} • Andar {room.floor}</Text>

            <View style={styles.roomActions}>
              <Pressable onPress={() => setEditing(room)} style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>Editar</Text>
              </Pressable>
              <Pressable
                onPress={() => void deactivate(room.id)}
                disabled={!room.active}
                style={[styles.secondaryAction, !room.active && styles.disabledAction]}
              >
                <Text style={styles.secondaryActionText}>Desativar</Text>
              </Pressable>
              <Pressable onPress={() => void remove(room.id)} style={styles.dangerAction}>
                <Text style={styles.dangerActionText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8FAFC',
    gap: 18,
    padding: 20,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    padding: 20,
  },
  eyebrow: {
    color: '#0F766E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 12,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  status: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  roomCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
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
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  inactiveTag: {
    backgroundColor: '#FEE2E2',
    borderRadius: 999,
    color: '#B91C1C',
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roomName: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  roomMeta: {
    color: '#475569',
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
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryActionText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  disabledAction: {
    opacity: 0.5,
  },
  dangerAction: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dangerActionText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
  },
});
