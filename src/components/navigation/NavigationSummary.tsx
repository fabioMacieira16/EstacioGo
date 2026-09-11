import { StyleSheet, Text, View } from 'react-native';

type NavigationSummaryProps = {
  originLabel: string;
  destinationLabel: string;
  distanceLabel: string;
  timeLabel?: string;
};

export function NavigationSummary({
  originLabel,
  destinationLabel,
  distanceLabel,
  timeLabel,
}: NavigationSummaryProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.row}>
        <Text style={styles.icon}>📍</Text>
        <View style={styles.copy}>
          <Text style={styles.label}>Você está aqui</Text>
          <Text style={styles.value}>{originLabel}</Text>
        </View>
      </View>

      <Text style={styles.arrow}>→</Text>

      <View style={styles.row}>
        <Text style={styles.icon}>🚶</Text>
        <View style={styles.copy}>
          <Text style={styles.value}>{distanceLabel}</Text>
          {timeLabel ? <Text style={styles.label}>{timeLabel}</Text> : null}
        </View>
      </View>

      <Text style={styles.arrow}>→</Text>

      <View style={styles.row}>
        <Text style={styles.icon}>📍</Text>
        <View style={styles.copy}>
          <Text style={styles.label}>Destino</Text>
          <Text style={styles.value}>{destinationLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  row: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  icon: { fontSize: 18 },
  copy: { flex: 1, gap: 2 },
  label: { color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  value: { color: '#0F172A', fontSize: 15, fontWeight: '800' },
  arrow: { color: '#CBD5E1', fontSize: 18, textAlign: 'center' },
});
