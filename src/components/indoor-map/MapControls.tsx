import { Pressable, StyleSheet, Text, View } from 'react-native';

import { navigationTheme } from '../../constants/navigationTheme';

type MapControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
};

export function MapControls({ onZoomIn, onZoomOut, onCenter }: MapControlsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.compass}>
        <Text style={styles.compassText}>N</Text>
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', bottom: 14, gap: 10, position: 'absolute', right: 14 },
  controls: { gap: 8 },
  button: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 8, height: 40, justifyContent: 'center', width: 40 },
  buttonText: { color: '#0F172A', fontSize: 24, fontWeight: '700' },
  centerButton: { alignItems: 'center', backgroundColor: navigationTheme.accent, borderRadius: 8, height: 40, justifyContent: 'center', width: 40 },
  centerText: { color: '#FFFFFF', fontSize: 24 },
  compass: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  compassText: { color: navigationTheme.accent, fontSize: 13, fontWeight: '800' },
});
