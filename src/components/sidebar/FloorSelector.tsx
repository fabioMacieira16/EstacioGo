import { Pressable, StyleSheet, Text, View } from 'react-native';

import { navigationTheme } from '../../constants/navigationTheme';
import type { IndoorFloor } from '../../types/indoorMap';

type FloorSelectorProps = {
  floors: IndoorFloor[];
  selectedFloorId: string;
  onSelect: (floorId: string) => void;
};

export function FloorSelector({ floors, selectedFloorId, onSelect }: FloorSelectorProps) {
  if (floors.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>🗂 Selecione o Andar</Text>
      <View style={styles.container}>
        {floors.map((floor) => {
          const active = floor.id === selectedFloorId;
          return (
            <Pressable
              key={floor.id}
              accessibilityRole="button"
              accessibilityLabel={`Visualizar ${floor.label}`}
              onPress={() => onSelect(floor.id)}
              style={[styles.button, active && styles.activeButton]}
            >
              <Text style={styles.icon}>🗄</Text>
              <Text style={[styles.text, active && styles.activeText]}>{floor.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  title: { color: navigationTheme.textPrimary, fontSize: 13, fontWeight: '800' },
  container: { gap: 8 },
  button: {
    alignItems: 'center',
    backgroundColor: navigationTheme.panelBackground,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  activeButton: { backgroundColor: navigationTheme.accent },
  icon: { fontSize: 14, opacity: 0.85 },
  text: { color: navigationTheme.textPrimary, fontSize: 14, fontWeight: '700' },
  activeText: { color: navigationTheme.textOnAccent },
});
