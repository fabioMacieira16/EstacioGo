import { Pressable, StyleSheet, Text, View } from 'react-native';

import { navigationTheme } from '../../constants/navigationTheme';

type NavigationHeaderProps = {
  roomName: string;
  buildingLabel?: string;
  floorLabel?: string;
  onBack: () => void;
  onOpenSidebar?: () => void;
};

export function NavigationHeader({
  roomName,
  buildingLabel,
  floorLabel,
  onBack,
  onOpenSidebar,
}: NavigationHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="Voltar"
        accessibilityRole="button"
        onPress={onBack}
        style={styles.iconButton}
      >
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>NAVEGAÇÃO</Text>
        <Text style={styles.title}>{roomName}</Text>
        {buildingLabel || floorLabel ? (
          <Text style={styles.location}>
            📍 {[buildingLabel, floorLabel].filter(Boolean).join(' • ')}
          </Text>
        ) : null}
      </View>
      {onOpenSidebar ? (
        <Pressable
          accessibilityLabel="Buscar e selecionar bloco"
          accessibilityRole="button"
          onPress={onOpenSidebar}
          style={styles.iconButton}
        >
          <Text style={styles.searchIcon}>🔎</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', gap: 14 },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backIcon: { color: '#0F172A', fontSize: 32, lineHeight: 36 },
  searchIcon: { fontSize: 18 },
  copy: { flex: 1, gap: 3 },
  eyebrow: { color: '#64748B', fontSize: 11, fontWeight: '800' },
  title: { color: '#0F172A', fontSize: 22, fontWeight: '800' },
  location: { color: navigationTheme.accent, fontSize: 13, fontWeight: '700' },
});
