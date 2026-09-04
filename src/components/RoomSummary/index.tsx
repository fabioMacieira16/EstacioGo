import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Room } from '../../types/room';

type RoomSummaryProps = { room: Room; onSelect: (room: Room) => void };

export function RoomSummary({ room, onSelect }: RoomSummaryProps) {
  return (
    <Pressable
      onPress={() => onSelect(room)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.header}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{room.code}</Text>
        </View>
        <Text style={styles.floorText}>Andar {room.floor}</Text>
      </View>

      <Text style={styles.title}>{room.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {room.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.location}>Bloco {room.buildingId}</Text>
        <Text style={styles.actionText}>Selecionar sala</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardPressed: {
    opacity: 0.96,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeBadge: {
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  codeText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
  },
  floorText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  location: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '700',
  },
  actionText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
});
