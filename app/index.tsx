import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { RoomSearch } from '../src/components/RoomSearch';
import { RoomSummary } from '../src/components/RoomSummary';
import { useRoomSearch } from '../src/hooks/useRoomSearch';
import type { Room } from '../src/types/room';

export default function HomeScreen() {
  const router = useRouter();
  const { rooms, loading, error, search } = useRoomSearch();
  const selectRoom = (room: Room) => router.push(`/room/${room.id}`);
  return (
    <View>
      <Text>Campus Route</Text>
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
