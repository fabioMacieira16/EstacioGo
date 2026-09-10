import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { IndoorMap } from '../../src/components/IndoorMap/IndoorMap';
import { campusIndoorMap } from '../../src/constants/indoorMap';
import { useRoute } from '../../src/hooks/useRoute';
import { useUserLocation } from '../../src/hooks/useUserLocation';

export default function RouteScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, loading, error } = useRoute(roomId);
  const userLocationState = useUserLocation();

  if (loading) return <ActivityIndicator />;
  if (error || !room) return <Text>{error ?? 'Sala não encontrada.'}</Text>;

  const indoorRoute = campusIndoorMap.routes[room.code.toLowerCase()];
  const destinationFloorId =
    campusIndoorMap.floors.find((floor) => floor.number === room.floor)?.id ??
    'ground-floor';

  const locationMessage =
    userLocationState.status === 'permission-denied'
      ? 'Localização desativada. A rota cadastrada continua disponível.'
      : userLocationState.status === 'unavailable'
        ? 'Localização indisponível. A rota cadastrada continua disponível.'
        : userLocationState.status === 'loading'
          ? 'Obtendo localização do dispositivo...'
          : userLocationState.accuracy
            ? `Localização atualizada. Precisão aproximada: ${Math.round(userLocationState.accuracy)} m.`
            : 'Localização do dispositivo atualizada.';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>NAVEGAÇÃO</Text>
          <Text style={styles.title}>{room.name}</Text>
        </View>
      </View>
      <View style={styles.roomDetails}>
        <Text style={styles.code}>{room.code}</Text>
        <Text style={styles.detail}>Bloco {room.buildingId}</Text>
        <Text style={styles.detail}>Andar {room.floor}</Text>
      </View>
      <View style={styles.distancePanel}>
        <Text style={styles.distanceLabel}>DISTÂNCIA INTERNA</Text>
        <Text style={styles.distance}>
          {indoorRoute ? `${indoorRoute.distanceMeters} m` : 'Rota não cadastrada'}
        </Text>
        {indoorRoute?.estimatedTimeMinutes ? (
          <Text style={styles.estimatedTime}>
            Aproximadamente {indoorRoute.estimatedTimeMinutes} min
          </Text>
        ) : null}
        <Text style={styles.destination}>Destino: {room.name}</Text>
      </View>
      <IndoorMap
        map={campusIndoorMap}
        routeKey={room.code.toLowerCase()}
        destinationFloorId={destinationFloorId}
        destinationRoomCode={room.code}
      />
      <Text style={styles.locationStatus}>
        {userLocationState.location
          ? `${locationMessage} O GPS é auxiliar; a rota interna usa a planta cadastrada.`
          : `${locationMessage} A navegação funciona pela Entrada Principal mesmo sem GPS.`}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC', gap: 14, padding: 20 },
  header: { alignItems: 'center', flexDirection: 'row', gap: 14 },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backIcon: { color: '#0F172A', fontSize: 32, lineHeight: 36 },
  eyebrow: { color: '#64748B', fontSize: 11, fontWeight: '800' },
  title: { color: '#0F172A', fontSize: 24, fontWeight: '800' },
  roomDetails: { flexDirection: 'row', gap: 12 },
  code: { color: '#2563EB', fontSize: 18, fontWeight: '800' },
  detail: { color: '#475569', fontSize: 16, paddingTop: 2 },
  distancePanel: {
    backgroundColor: '#0F766E',
    borderRadius: 8,
    gap: 4,
    padding: 18,
  },
  distanceLabel: { color: '#CCFBF1', fontSize: 11, fontWeight: '800' },
  distance: { color: '#FFFFFF', fontSize: 28, fontWeight: '800' },
  estimatedTime: { color: '#CCFBF1', fontSize: 14 },
  destination: { color: '#CCFBF1', fontSize: 14 },
  floorPlanTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  floorPlan: {
    height: 300,
    width: '100%',
  },
  locationStatus: { color: '#64748B', fontSize: 13, lineHeight: 19 },
});
