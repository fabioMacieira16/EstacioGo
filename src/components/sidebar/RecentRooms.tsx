import { Pressable, StyleSheet, Text, View } from 'react-native';

import { navigationTheme } from '../../constants/navigationTheme';
import type { RecentRoomEntry } from '../../services/recentRoomsService';

type RecentRoomsProps = {
  rooms: RecentRoomEntry[];
  onSelect: (room: RecentRoomEntry) => void;
};

export function RecentRooms({ rooms, onSelect }: RecentRoomsProps) {
  if (rooms.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕐 Salas Recentes</Text>
      <View style={styles.list}>
        {rooms.map((room) => (
          <Pressable
            accessibilityRole="button"
            key={room.id}
            onPress={() => onSelect(room)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Text style={styles.rowText}>{room.code}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  title: {
    color: navigationTheme.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  list: { gap: 6 },
  row: {
    alignItems: 'center',
    backgroundColor: navigationTheme.panelBackground,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  rowPressed: { opacity: 0.8 },
  rowText: { color: navigationTheme.textPrimary, fontSize: 13, fontWeight: '700' },
  chevron: { color: navigationTheme.textSecondary, fontSize: 16, fontWeight: '700' },
});
