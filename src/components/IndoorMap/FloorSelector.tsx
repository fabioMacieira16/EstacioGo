import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { IndoorFloor } from '../../types/indoorMap';

type FloorSelectorProps = {
  floors: IndoorFloor[];
  selectedFloorId: string;
  onSelect: (floorId: string) => void;
};

export function FloorSelector({ floors, selectedFloorId, onSelect }: FloorSelectorProps) {
  return (
    <View style={styles.container}>
      {floors.map((floor) => (
        <Pressable
          key={floor.id}
          accessibilityRole="button"
          accessibilityLabel={`Visualizar ${floor.label}`}
          onPress={() => onSelect(floor.id)}
          style={[styles.button, floor.id === selectedFloorId && styles.activeButton]}
        >
          <Text style={[styles.text, floor.id === selectedFloorId && styles.activeText]}>
            {floor.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8 },
  button: { backgroundColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9 },
  activeButton: { backgroundColor: '#0F766E' },
  text: { color: '#334155', fontSize: 13, fontWeight: '700' },
  activeText: { color: '#FFFFFF' },
});
