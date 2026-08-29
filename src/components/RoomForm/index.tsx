import { useState } from 'react';
import { Button, Switch, Text, TextInput, View } from 'react-native';

import type { RoomInput } from '../../types/room';

type RoomFormProps = {
  initialValue?: RoomInput;
  onSubmit: (input: RoomInput) => Promise<void>;
};
const emptyRoom: RoomInput = {
  code: '',
  name: '',
  buildingId: '',
  floor: 0,
  description: '',
  destination: { latitude: 0, longitude: 0 },
  routeId: null,
  active: true,
};

export function RoomForm({
  initialValue = emptyRoom,
  onSubmit,
}: RoomFormProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const update = <K extends keyof RoomInput>(
    field: K,
    fieldValue: RoomInput[K],
  ) => setValue((current) => ({ ...current, [field]: fieldValue }));

  async function submit() {
    try {
      setError(null);
      await onSubmit(value);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível salvar.',
      );
    }
  }

  return (
    <View>
      <TextInput
        placeholder="Código"
        value={value.code}
        onChangeText={(input) => update('code', input)}
      />
      <TextInput
        placeholder="Nome"
        value={value.name}
        onChangeText={(input) => update('name', input)}
      />
      <TextInput
        placeholder="Bloco"
        value={value.buildingId}
        onChangeText={(input) => update('buildingId', input)}
      />
      <TextInput
        placeholder="Andar"
        keyboardType="numeric"
        value={String(value.floor)}
        onChangeText={(input) => update('floor', Number(input))}
      />
      <TextInput
        placeholder="Descrição"
        value={value.description}
        onChangeText={(input) => update('description', input)}
      />
      <TextInput
        placeholder="Latitude do destino"
        keyboardType="numeric"
        value={String(value.destination.latitude)}
        onChangeText={(input) =>
          update('destination', {
            ...value.destination,
            latitude: Number(input),
          })
        }
      />
      <TextInput
        placeholder="Longitude do destino"
        keyboardType="numeric"
        value={String(value.destination.longitude)}
        onChangeText={(input) =>
          update('destination', {
            ...value.destination,
            longitude: Number(input),
          })
        }
      />
      <TextInput
        placeholder="ID da rota (opcional)"
        value={value.routeId ?? ''}
        onChangeText={(input) => update('routeId', input || null)}
      />
      <Text>Ativa</Text>
      <Switch
        value={value.active}
        onValueChange={(input) => update('active', input)}
      />
      {error ? <Text>{error}</Text> : null}
      <Button title="Salvar sala" onPress={() => void submit()} />
    </View>
  );
}
