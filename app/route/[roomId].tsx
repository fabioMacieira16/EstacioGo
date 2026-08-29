import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

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
      <Text style={styles.floorPlanTitle}>Planta da faculdade</Text>
      <Image
        source={require('../../Documentation/mapa_da_faculdade.jpeg')}
        style={styles.floorPlan}
        resizeMode="contain"
        accessibilityLabel="Planta baixa da faculdade"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  floorPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  floorPlan: {
    height: 360,
    marginTop: 8,
    width: '100%',
  },
});
