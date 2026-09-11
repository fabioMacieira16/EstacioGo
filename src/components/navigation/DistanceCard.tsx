import { StyleSheet, Text, View } from 'react-native';

import { navigationTheme } from '../../constants/navigationTheme';

type DistanceCardProps = {
  distanceLabel: string;
  timeLabel?: string;
};

export function DistanceCard({ distanceLabel, timeLabel }: DistanceCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <Text style={styles.icon}>🧭</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.label}>Distância aproximada</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{distanceLabel}</Text>
          {timeLabel ? <Text style={styles.time}>🚶 {timeLabel}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBadge: {
    alignItems: 'center',
    backgroundColor: navigationTheme.accent,
    borderRadius: 10,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  icon: { fontSize: 18 },
  copy: { gap: 2 },
  label: { color: '#64748B', fontSize: 11, fontWeight: '700' },
  valueRow: { alignItems: 'baseline', flexDirection: 'row', gap: 10 },
  value: { color: '#0F172A', fontSize: 20, fontWeight: '800' },
  time: { color: navigationTheme.accent, fontSize: 13, fontWeight: '800' },
});
