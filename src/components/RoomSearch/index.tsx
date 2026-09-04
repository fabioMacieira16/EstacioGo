import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type RoomSearchProps = { onSearch: (term: string) => void };

export function RoomSearch({ onSearch }: RoomSearchProps) {
  const [term, setTerm] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Buscar sala</Text>
      <View style={styles.searchRow}>
        <TextInput
          accessibilityLabel="Código ou nome da sala"
          onChangeText={setTerm}
          placeholder="Digite código ou nome"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={term}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => onSearch(term)}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Pesquisar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    color: '#0F172A',
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
