import { StyleSheet, Text, View } from 'react-native';

const ITEMS: { symbol: string; color?: string; label: string }[] = [
  { symbol: '●', color: '#0F766E', label: 'Entrada' },
  { symbol: '━', color: '#42B8D2', label: 'Rota' },
  { symbol: '📍', label: 'Destino' },
  { symbol: '◎', color: '#F59E0B', label: 'Você está aqui' },
  { symbol: '▥', color: '#8B9498', label: 'Escada' },
  { symbol: '▥', color: '#8B9498', label: 'Elevador' },
  { symbol: '▯', color: '#8B9498', label: 'Porta' },
];

export function MapLegend() {
  return (
    <View style={styles.container}>
      {ITEMS.map((item) => (
        <View key={item.label} style={styles.item}>
          <Text style={[styles.symbol, item.color ? { color: item.color } : null]}>
            {item.symbol}
          </Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  item: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  symbol: { color: '#334155', fontSize: 14, fontWeight: '800' },
  label: { color: '#64748B', fontSize: 12, fontWeight: '600' },
});
