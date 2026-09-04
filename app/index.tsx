import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
  const userName = user?.email?.split('@')[0] ?? 'Aluno';
  const userRoleLabel = user?.role === 'ADMIN' ? 'Administrador' : 'Aluno';

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.heroCard}>
        <View>
          <Text style={styles.eyebrow}>CAMPUS ROUTE</Text>
          <Text style={styles.title}>Olá, {userName}</Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{userRoleLabel}</Text>
        </View>
        <Text style={styles.subtitle}>{user?.email}</Text>
      </View>

      <View style={styles.actionsRow}>
        <ActionButton label="Sair" onPress={() => void logout()} variant="secondary" />
        {user?.role === 'ADMIN' ? (
          <ActionButton
            label="Administrar salas"
            onPress={() => router.push('/admin/rooms')}
            variant="primary"
          />
        ) : null}
      </View>

      <RoomSearch onSearch={(term) => void search(term)} />

      {loading ? <ActivityIndicator style={styles.loader} color="#0F766E" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Salas disponíveis</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={rooms}
        keyExtractor={(room) => room.id}
        renderItem={({ item }) => <RoomSummary room={item} onSelect={selectRoom} />}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

function ActionButton({
  label,
  onPress,
  variant,
}: {
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        variant === 'primary' ? styles.primaryAction : styles.secondaryAction,
        pressed && styles.actionButtonPressed,
      ]}
    >
      <Text
        style={
          variant === 'primary' ? styles.primaryActionText : styles.secondaryActionText
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8FAFC',
    gap: 18,
    padding: 20,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
  },
  eyebrow: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#475569',
    fontSize: 14,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  roleText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    paddingVertical: 12,
  },
  primaryAction: {
    backgroundColor: '#0F766E',
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 1,
  },
  actionButtonPressed: {
    opacity: 0.9,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryActionText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  loader: {
    marginVertical: 8,
  },
  error: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  listHeader: {
    marginTop: 6,
  },
  listTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    paddingBottom: 4,
  },
});
