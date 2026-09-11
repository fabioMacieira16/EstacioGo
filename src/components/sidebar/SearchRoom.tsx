import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { navigationTheme } from '../../constants/navigationTheme';
import { useRoomSearch } from '../../hooks/useRoomSearch';
import type { Room } from '../../types/room';

type SearchRoomProps = {
  onSelect: (room: Room) => void;
};

export function SearchRoom({ onSelect }: SearchRoomProps) {
  const [term, setTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { rooms, loading, search } = useRoomSearch();

  function runSearch(value: string) {
    setTerm(value);
    setHasSearched(value.trim().length > 0);
    void search(value.trim());
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Text style={styles.icon}>🔎</Text>
        <TextInput
          accessibilityLabel="Buscar sala"
          onChangeText={runSearch}
          placeholder="Buscar sala (ex: F101)"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={term}
        />
      </View>
      {hasSearched ? (
        <FlatList
          data={rooms}
          keyExtractor={(room) => room.id}
          scrollEnabled={false}
          style={styles.results}
          ListEmptyComponent={
            loading ? null : <Text style={styles.emptyText}>Nenhuma sala encontrada.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                onSelect(item);
                setTerm('');
                setHasSearched(false);
              }}
              style={({ pressed }) => [styles.resultItem, pressed && styles.resultItemPressed]}
            >
              <Text style={styles.resultCode}>{item.code}</Text>
              <Text style={styles.resultName} numberOfLines={1}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  inputRow: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
  },
  icon: { fontSize: 14 },
  input: {
    color: '#0F172A',
    flex: 1,
    fontSize: 14,
    minHeight: 44,
    paddingVertical: 10,
  },
  results: { maxHeight: 220 },
  emptyText: { color: '#94A3B8', fontSize: 12, paddingVertical: 8 },
  resultItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
    marginBottom: 6,
    padding: 10,
  },
  resultItemPressed: { backgroundColor: '#EFF6FF' },
  resultCode: { color: navigationTheme.accent, fontSize: 12, fontWeight: '800' },
  resultName: { color: '#0F172A', fontSize: 13, fontWeight: '600' },
});
