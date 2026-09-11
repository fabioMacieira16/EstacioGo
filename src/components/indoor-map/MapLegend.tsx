import { StyleSheet, Text, View } from 'react-native';

import { navigationTheme } from '../../constants/navigationTheme';

const ITEMS: { symbol: string; color: string; label: string }[] = [
  { symbol: '●', color: '#10B981', label: 'Entrada' },
  { symbol: '━', color: navigationTheme.accent, label: 'Rota' },
  { symbol: '📍', color: '#DC2626', label: 'Destino' },
  { symbol: '◎', color: navigationTheme.accent, label: 'Você está aqui' },
  { symbol: '⚌', color: navigationTheme.textSecondary, label: 'Escada' },
  { symbol: '⬍', color: navigationTheme.textSecondary, label: 'Elevador' },
  { symbol: '▯', color: navigationTheme.textSecondary, label: 'Porta' },
];

export function MapLegend() {
  return (
    <View style={styles.container}>
      {ITEMS.map((item) => (
        <View key={item.label} style={styles.item}>
          <Text style={[styles.symbol, { color: item.color }]}>{item.symbol}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: navigationTheme.sidebarBackground,
    borderRadius: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  item: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  symbol: { fontSize: 14, fontWeight: '800' },
  label: { color: navigationTheme.textSecondary, fontSize: 12, fontWeight: '600' },
});
