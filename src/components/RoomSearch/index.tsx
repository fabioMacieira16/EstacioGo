import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

type RoomSearchProps = { onSearch: (term: string) => void };

export function RoomSearch({ onSearch }: RoomSearchProps) {
  const [term, setTerm] = useState('');
  return (
    <View>
      <TextInput
        accessibilityLabel="Código ou nome da sala"
        onChangeText={setTerm}
        placeholder="Digite código ou nome"
        value={term}
      />
      <Button title="Pesquisar" onPress={() => onSearch(term)} />
    </View>
  );
}
