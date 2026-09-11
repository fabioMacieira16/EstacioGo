import { StyleSheet, Text, View } from 'react-native';

import { navigationTheme } from '../../constants/navigationTheme';

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
        <View style={[styles.iconBadge, { backgroundColor: '#10B981' }]}>
          <Text style={styles.icon}>📍</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.label}>Você está aqui</Text>
          <Text style={styles.value}>{originLabel}</Text>
        </View>
      </View>

      <Text style={styles.arrow}>›</Text>

      <View style={styles.row}>
        <View style={[styles.iconBadge, { backgroundColor: navigationTheme.accent }]}>
          <Text style={styles.icon}>🚶</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.value}>{distanceLabel}</Text>
          {timeLabel ? <Text style={styles.label}>{timeLabel}</Text> : null}
        </View>
      </View>

      <Text style={styles.arrow}>›</Text>

      <View style={styles.row}>
        <View style={[styles.iconBadge, { backgroundColor: '#DC2626' }]}>
          <Text style={styles.icon}>📍</Text>
        </View>
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 16,
  },
  row: { alignItems: 'center', flexDirection: 'row', flexShrink: 1, gap: 10 },
  iconBadge: {
    alignItems: 'center',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  icon: { fontSize: 15 },
  copy: { gap: 2 },
  label: { color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  value: { color: '#0F172A', fontSize: 15, fontWeight: '800' },
  arrow: { color: '#CBD5E1', fontSize: 20, fontWeight: '800' },
});
