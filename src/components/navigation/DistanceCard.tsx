import { StyleSheet, Text, View } from 'react-native';

type DistanceCardProps = {
  distanceLabel: string;
  timeLabel?: string;
};

export function DistanceCard({ distanceLabel, timeLabel }: DistanceCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Distância aproximada</Text>
        <Text style={styles.value}>{distanceLabel}</Text>
      </View>
      {timeLabel ? (
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>🚶 {timeLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  label: { color: '#CCFBF1', fontSize: 12, fontWeight: '700' },
  value: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  timeBadge: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
