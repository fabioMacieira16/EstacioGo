import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useRoute } from '../../src/hooks/useRoute';

export default function RoomDetailsScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, loading, error } = useRoute(roomId);

  if (loading) return <ActivityIndicator />;
  if (error || !room) return <Text>{error ?? 'Sala não encontrada.'}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>DETALHES DA SALA</Text>
      <Text style={styles.title}>{room.name}</Text>
      <Text style={styles.code}>{room.code}</Text>
      <View style={styles.infoPanel}>
        <Text style={styles.infoLabel}>LOCALIZAÇÃO</Text>
        <Text style={styles.infoValue}>Bloco {room.buildingId}</Text>
        <Text style={styles.infoValue}>Andar {room.floor}</Text>
        <Text style={styles.description}>{room.description}</Text>
      </View>
      <Button
        title="Iniciar navegação"
        onPress={() => router.push(`/route/${room.id}`)}
      />
      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16, padding: 24 },
  eyebrow: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  title: { color: '#0F172A', fontSize: 28, fontWeight: '800' },
  code: { color: '#2563EB', fontSize: 18, fontWeight: '700' },
  infoPanel: { backgroundColor: '#F1F5F9', gap: 6, padding: 18 },
  infoLabel: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  infoValue: { color: '#0F172A', fontSize: 17, fontWeight: '600' },
  description: { color: '#475569', marginTop: 8 },
});
