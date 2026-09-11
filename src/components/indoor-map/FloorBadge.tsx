import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { IndoorFloor } from '../../types/indoorMap';

type FloorBadgeProps = {
  floors: IndoorFloor[];
  selectedFloorId: string;
  onSelect: (floorId: string) => void;
};

export function FloorBadge({ floors, selectedFloorId, onSelect }: FloorBadgeProps) {
  const [open, setOpen] = useState(false);
  const current = floors.find((floor) => floor.id === selectedFloorId);
  if (!current) return null;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Selecionar andar"
        onPress={() => setOpen((value) => !value)}
        style={styles.badge}
      >
        <Text style={styles.badgeText}>🏢 {current.label} ▾</Text>
      </Pressable>
      {open ? (
        <View style={styles.menu}>
          {floors.map((floor) => (
            <Pressable
              key={floor.id}
              accessibilityRole="button"
              onPress={() => {
                onSelect(floor.id);
                setOpen(false);
              }}
              style={[styles.menuItem, floor.id === selectedFloorId && styles.menuItemActive]}
            >
              <Text
                style={[styles.menuItemText, floor.id === selectedFloorId && styles.menuItemTextActive]}
              >
                {floor.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { left: 14, position: 'absolute', top: 14 },
  badge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  badgeText: { color: '#0F172A', fontSize: 13, fontWeight: '800' },
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    gap: 2,
    marginTop: 6,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  menuItem: { paddingHorizontal: 14, paddingVertical: 10 },
  menuItemActive: { backgroundColor: '#F0FDFA' },
  menuItemText: { color: '#334155', fontSize: 13, fontWeight: '600' },
  menuItemTextActive: { color: '#0F766E', fontWeight: '800' },
});
