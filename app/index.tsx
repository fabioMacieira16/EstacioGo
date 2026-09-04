import { useRouter } from 'expo-router';
import { ActivityIndicator, Button, FlatList, Text, View } from 'react-native';

import { RoomSearch } from '../src/components/RoomSearch';
import { RoomSummary } from '../src/components/RoomSummary';
import { useAuth } from '../src/hooks/useAuth';
import { useRoomSearch } from '../src/hooks/useRoomSearch';
import type { Room } from '../src/types/room';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { rooms, loading, error, search } = useRoomSearch();
  const selectRoom = (room: Room) => router.push(`/room/${room.id}`);
  return (
    <View>
      <Text>Campus Route</Text>
      <Text>{user?.email}</Text>
      <Text>{user?.role}</Text>
      <Button title="Sair" onPress={() => void logout()} />
      {user?.role === 'ADMIN' ? (
        <Button
          title="Administrar salas"
          onPress={() => router.push('/admin/rooms')}
        />
      ) : null}
      <RoomSearch onSearch={(term) => void search(term)} />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text>{error}</Text> : null}
      <FlatList
        data={rooms}
        keyExtractor={(room) => room.id}
        renderItem={({ item }) => (
          <RoomSummary room={item} onSelect={selectRoom} />
        )}
      />
    </View>
  );
}
