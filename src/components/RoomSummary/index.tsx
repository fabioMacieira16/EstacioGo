import { Button, Text, View } from 'react-native';

import type { Room } from '../../types/room';

type RoomSummaryProps = { room: Room; onSelect: (room: Room) => void };

export function RoomSummary({ room, onSelect }: RoomSummaryProps) {
  return (
    <View>
      <Text>
        {room.code} - {room.name}
      </Text>
      <Text>{room.description}</Text>
      <Text>
        Bloco {room.buildingId} - Andar {room.floor}
      </Text>
      <Button title="Selecionar sala" onPress={() => onSelect(room)} />
    </View>
  );
}
