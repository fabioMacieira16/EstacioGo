import { Pressable, StyleSheet, Text, View } from 'react-native';

type MapControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
};

export function MapControls({ onZoomIn, onZoomOut, onCenter }: MapControlsProps) {
  return (
    <View style={styles.controls}>
      <Pressable accessibilityLabel="Aumentar zoom" onPress={onZoomIn} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
      <Pressable accessibilityLabel="Reduzir zoom" onPress={onZoomOut} style={styles.button}>
        <Text style={styles.buttonText}>−</Text>
      </Pressable>
      <Pressable accessibilityLabel="Centralizar rota" onPress={onCenter} style={styles.centerButton}>
        <Text style={styles.centerText}>⌖</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: { gap: 8, position: 'absolute', right: 14, top: 14 },
  button: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 8, height: 40, justifyContent: 'center', width: 40 },
  buttonText: { color: '#0F172A', fontSize: 24, fontWeight: '700' },
  centerButton: { alignItems: 'center', backgroundColor: '#0F766E', borderRadius: 8, height: 40, justifyContent: 'center', width: 40 },
  centerText: { color: '#FFFFFF', fontSize: 24 },
});
