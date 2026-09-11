import { Pressable, StyleSheet, Text, View } from 'react-native';

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
      <Text style={styles.title}>Selecione o andar</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  title: { color: '#334155', fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: { backgroundColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9 },
  activeButton: { backgroundColor: '#0F766E' },
  text: { color: '#334155', fontSize: 13, fontWeight: '700' },
  activeText: { color: '#FFFFFF' },
});
