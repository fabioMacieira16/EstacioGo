import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteEditor } from '../../src/components/RouteEditor';
import { navigationTheme } from '../../src/constants/navigationTheme';
import { routeService } from '../../src/services/routeService';

export default function AdminRoutesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: navigationTheme.sidebarBackground,
    flex: 1,
  },
  screen: {
    gap: 18,
    padding: 20,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: navigationTheme.panelBackground,
    borderColor: navigationTheme.panelBorder,
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
    backgroundColor: navigationTheme.sidebarBackground,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backIcon: { color: navigationTheme.textPrimary, fontSize: 32, lineHeight: 36 },
  eyebrow: {
    color: navigationTheme.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: navigationTheme.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: navigationTheme.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  editorCard: {
    backgroundColor: navigationTheme.panelBackground,
    borderColor: navigationTheme.panelBorder,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
});
