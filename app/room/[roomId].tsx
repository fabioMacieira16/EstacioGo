import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useRoute } from '../../src/hooks/useRoute';

export default function RoomDetailsScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, loading, error } = useRoute(roomId);

  if (loading) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator color="#0F766E" size="large" />
        <Text style={styles.stateText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (error || !room) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.errorTitle}>Não foi possível encontrar a sala</Text>
        <Text style={styles.stateText}>{error ?? 'Sala não encontrada.'}</Text>
        <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

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
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>DETALHES DA SALA</Text>
          <Text style={styles.title}>{room.name}</Text>
        </View>
      </View>

      <View style={styles.identityPanel}>
        <View style={styles.codeBadge}>
          <Text style={styles.code}>{room.code}</Text>
        </View>
        <Text style={styles.identityTitle}>{room.name}</Text>
        <Text style={styles.identitySubtitle}>
          Consulte a localização e inicie uma rota até este espaço.
        </Text>
      </View>

      <View style={styles.infoPanel}>
        <Text style={styles.sectionTitle}>Localização</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="Bloco" value={room.buildingId} />
          <InfoItem label="Andar" value={String(room.floor)} />
        </View>
      </View>

      <View style={styles.descriptionPanel}>
        <Text style={styles.sectionTitle}>Sobre este espaço</Text>
        <Text style={styles.description}>{room.description}</Text>
      </View>

      <View style={styles.actionPanel}>
        <Text style={styles.actionTitle}>Pronto para encontrar a sala?</Text>
        <Text style={styles.actionHint}>
          Veja o caminho sugerido a partir da entrada do campus.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/route/${room.id}`)}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Iniciar navegação</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    gap: 16,
    padding: 20,
    paddingBottom: 32,
  },
  centeredState: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  stateText: { color: '#64748B', fontSize: 14, textAlign: 'center' },
  errorTitle: { color: '#0F172A', fontSize: 18, fontWeight: '800', textAlign: 'center' },
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
  headerCopy: { flex: 1, gap: 4 },
  eyebrow: { color: '#0F766E', fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  title: { color: '#0F172A', fontSize: 25, fontWeight: '800' },
  identityPanel: {
    backgroundColor: '#0F766E',
    borderRadius: 18,
    gap: 8,
    padding: 20,
  },
  codeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#CCFBF1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  code: { color: '#115E59', fontSize: 13, fontWeight: '800' },
  identityTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  identitySubtitle: { color: '#CCFBF1', fontSize: 13, lineHeight: 19 },
  infoPanel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  sectionTitle: { color: '#0F172A', fontSize: 15, fontWeight: '800' },
  infoGrid: { flexDirection: 'row', gap: 12 },
  infoItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    flex: 1,
    gap: 5,
    padding: 12,
  },
  infoLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  infoValue: { color: '#0F172A', fontSize: 17, fontWeight: '700' },
  descriptionPanel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  description: { color: '#475569', fontSize: 14, lineHeight: 21 },
  actionPanel: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  actionTitle: { color: '#065F46', fontSize: 16, fontWeight: '800' },
  actionHint: { color: '#047857', fontSize: 13, lineHeight: 19 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 10,
    marginTop: 6,
    minHeight: 46,
    justifyContent: 'center',
  },
  primaryButtonPressed: { opacity: 0.9 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  secondaryButton: {
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  secondaryButtonText: { color: '#334155', fontSize: 14, fontWeight: '700' },
});
