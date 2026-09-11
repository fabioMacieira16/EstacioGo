import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecentRoomEntry } from '../../services/recentRoomsService';

type RecentRoomsProps = {
  rooms: RecentRoomEntry[];
  onSelect: (room: RecentRoomEntry) => void;
};

export function RecentRooms({ rooms, onSelect }: RecentRoomsProps) {
  if (rooms.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salas recentes</Text>
      <View style={styles.list}>
        {rooms.map((room) => (
          <Pressable
            accessibilityRole="button"
            key={room.id}
            onPress={() => onSelect(room)}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
          >
            <Text style={styles.chipText}>{room.code}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  title: { color: '#334155', fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  list: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E0F2FE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipPressed: { opacity: 0.8 },
  chipText: { color: '#0F172A', fontSize: 12, fontWeight: '700' },
});
