import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CampusMap } from '../../src/components/CampusMap';
import { DEFAULT_MAP_ORIGIN } from '../../src/constants/map';
import { useRoute } from '../../src/hooks/useRoute';
import { useUserLocation } from '../../src/hooks/useUserLocation';
import {
  calculateRouteDistance,
  formatDistance,
} from '../../src/utils/distance';

export default function RouteScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, route, loading, error } = useRoute(roomId);
  const userLocationState = useUserLocation();

  if (loading) return <ActivityIndicator />;
  if (error || !room) return <Text>{error ?? 'Sala não encontrada.'}</Text>;

  const origin = route?.origin ?? DEFAULT_MAP_ORIGIN;
  const destination = route?.destination ?? room.destination;
  const routeCoordinates = route?.coordinates ?? [origin, destination];

  const locationMessage =
    userLocationState.status === 'permission-denied'
      ? 'Localização desativada. A rota cadastrada continua disponível.'
      : userLocationState.status === 'unavailable'
        ? 'Localização indisponível. A rota cadastrada continua disponível.'
        : userLocationState.status === 'loading'
          ? 'Obtendo localização do dispositivo...'
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
        <Text style={styles.distanceLabel}>DISTÂNCIA APROXIMADA</Text>
        <Text style={styles.distance}>
          {formatDistance(calculateRouteDistance(routeCoordinates))}
        </Text>
        <Text style={styles.destination}>Destino: {room.name}</Text>
      </View>
      <CampusMap
        origin={origin}
        destination={destination}
        routeCoordinates={routeCoordinates}
        userLocation={userLocationState.location}
      />
      <Text style={styles.locationStatus}>{locationMessage}</Text>
      <Text style={styles.floorPlanTitle}>Referência da planta</Text>
      <Image
        source={require('../../Documentation/mapa_da_faculdade.jpeg')}
        style={styles.floorPlan}
        resizeMode="contain"
        accessibilityLabel="Planta baixa da faculdade"
      />
      <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Voltar</Text>
      </Pressable>
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
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#CBD5E1',
    borderRadius: 6,
    borderWidth: 1,
    padding: 14,
  },
  secondaryButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  locationStatus: { color: '#64748B', fontSize: 13, lineHeight: 19 },
});
