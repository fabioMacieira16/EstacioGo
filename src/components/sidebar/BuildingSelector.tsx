import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Building } from '../../types/building';

type BuildingSelectorProps = {
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelect: (buildingId: string) => void;
};

export function BuildingSelector({ buildings, selectedBuildingId, onSelect }: BuildingSelectorProps) {
  if (buildings.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blocos</Text>
      <View style={styles.list}>
        {buildings.map((building) => {
          const active = building.code === selectedBuildingId;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Visualizar ${building.name}`}
              key={building.id}
              onPress={() => onSelect(building.code)}
              style={[styles.item, active && styles.activeItem]}
            >
              <View style={[styles.badge, active && styles.activeBadge]}>
                <Text style={[styles.badgeText, active && styles.activeBadgeText]}>
                  {building.code}
                </Text>
              </View>
              <Text style={[styles.name, active && styles.activeName]}>{building.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  title: { color: '#334155', fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  list: { gap: 6 },
  item: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  activeItem: { backgroundColor: '#0F766E' },
  badge: {
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  activeBadge: { backgroundColor: '#FFFFFF' },
  badgeText: { color: '#334155', fontSize: 12, fontWeight: '800' },
  activeBadgeText: { color: '#0F766E' },
  name: { color: '#334155', fontSize: 13, fontWeight: '700' },
  activeName: { color: '#FFFFFF' },
});
