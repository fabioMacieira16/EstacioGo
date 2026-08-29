import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { CampusMap } from '../../src/components/CampusMap';
import { DEFAULT_MAP_ORIGIN } from '../../src/constants/map';
import { useRoute } from '../../src/hooks/useRoute';

export default function RouteScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, route, loading, error } = useRoute(roomId);

  if (loading) return <ActivityIndicator />;
  if (error || !room) return <Text>{error ?? 'Sala não encontrada.'}</Text>;

  return (
    <View>
      <Text>
        {room.code} - {room.name}
      </Text>
      <Text>
        Bloco {room.buildingId} - Andar {room.floor}
      </Text>
      <Text>Rota selecionada: {room.routeId ?? 'não disponível'}</Text>
      <CampusMap
        origin={route?.origin ?? DEFAULT_MAP_ORIGIN}
        destination={route?.destination ?? room.destination}
        routeCoordinates={route?.coordinates ?? []}
      />
    </View>
  );
}
