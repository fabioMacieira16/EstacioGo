import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';

import { RoomForm } from '../../src/components/RoomForm';
import { useRooms } from '../../src/hooks/useRooms';
import type { Room } from '../../src/types/room';

export default function AdminRoomsScreen() {
  const router = useRouter();
  const { rooms, loading, error, create, update, deactivate, remove } =
    useRooms();
  const [editing, setEditing] = useState<Room | null>(null);
  const inputFromRoom = (room: Room) => {
    const { id: _id, ...input } = room;
    return input;
  };

  return (
    <ScrollView>
      <Text>Administração de salas</Text>
      <Button
        title="Abrir editor de rotas"
        onPress={() => router.push('/admin/routes')}
      />
      <RoomForm
        key={editing?.id ?? 'new'}
        initialValue={editing ? inputFromRoom(editing) : undefined}
        onSubmit={async (input) => {
          if (editing) await update(editing.id, input);
          else await create(input);
          setEditing(null);
        }}
      />
      {loading ? <Text>Carregando...</Text> : null}
      {error ? <Text>{error}</Text> : null}
      {rooms.map((room) => (
        <View key={room.id}>
          <Text>
            {room.code} - {room.name} {room.active ? '' : '(desativada)'}
          </Text>
          <Button title="Editar" onPress={() => setEditing(room)} />
          <Button
            title="Desativar"
            onPress={() => void deactivate(room.id)}
            disabled={!room.active}
          />
          <Button title="Excluir" onPress={() => void remove(room.id)} />
        </View>
      ))}
    </ScrollView>
  );
}
