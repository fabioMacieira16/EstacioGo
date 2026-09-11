import { Pressable, StyleSheet, Text, View } from 'react-native';

import { navigationTheme } from '../../constants/navigationTheme';
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
      <Text style={styles.title}>🏢 Blocos</Text>
      <View style={styles.grid}>
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
              <Text style={[styles.name, active && styles.activeName]} numberOfLines={1}>
                Bloco {building.code}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  title: { color: navigationTheme.textPrimary, fontSize: 13, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: {
    alignItems: 'center',
    backgroundColor: navigationTheme.panelBackground,
    borderRadius: 10,
    flexBasis: '47%',
    flexDirection: 'row',
    flexGrow: 1,
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  activeItem: { backgroundColor: navigationTheme.accent },
  badge: {
    alignItems: 'center',
    backgroundColor: navigationTheme.sidebarBackground,
    borderRadius: 6,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  activeBadge: { backgroundColor: navigationTheme.textOnAccent },
  badgeText: { color: navigationTheme.textPrimary, fontSize: 12, fontWeight: '800' },
  activeBadgeText: { color: navigationTheme.accent },
  name: { color: navigationTheme.textSecondary, fontSize: 12, fontWeight: '700' },
  activeName: { color: navigationTheme.textOnAccent },
});
