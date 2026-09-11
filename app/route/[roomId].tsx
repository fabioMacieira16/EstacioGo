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

export default function RouteScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, loading, error } = useRoute(roomId);

  if (loading) return <ActivityIndicator />;
  if (error || !room) return <Text>{error ?? 'Sala não encontrada.'}</Text>;

  const destinationFloorId =
    campusIndoorMap.floors.find((floor) => floor.number === room.floor)?.id ??
    'ground-floor';

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
      <IndoorMap
        map={campusIndoorMap}
        routeKey={room.code.toLowerCase()}
        destinationFloorId={destinationFloorId}
        destinationRoomCode={room.code}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC', gap: 12, padding: 16 },
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
});
