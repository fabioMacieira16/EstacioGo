import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RouteEditor } from '../../src/components/RouteEditor';
import { routeService } from '../../src/services/routeService';

export default function AdminRoutesScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <View />
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
        </View>
        <Text style={styles.eyebrow}>ADMINISTRAÇÃO</Text>
        <Text style={styles.title}>Editor de rotas</Text>
        <Text style={styles.subtitle}>
          Crie o caminho no mapa definindo origem, pontos intermediários e destino.
        </Text>
      </View>

      <View style={styles.editorCard}>
        <RouteEditor
          onSave={async (route) => {
            await routeService.createRoute(route);
            router.back();
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8FAFC',
    gap: 18,
    padding: 20,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 24,
    borderWidth: 1,
    gap: 6,
    padding: 20,
  },
  headerTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backIcon: { color: '#0F172A', fontSize: 32, lineHeight: 36 },
  eyebrow: {
    color: '#0F766E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  editorCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
});
