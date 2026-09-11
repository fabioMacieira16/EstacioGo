import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navigationTheme } from '../../constants/navigationTheme';

export const SIDEBAR_BREAKPOINT = 768;

type SidebarPanelProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function SidebarPanel({ visible, onClose, children }: SidebarPanelProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= SIDEBAR_BREAKPOINT;
  const insets = useSafeAreaInsets();

  if (isWide) {
    return (
      <ScrollView style={styles.fixedPanel} contentContainerStyle={styles.fixedPanelContent}>
        {children}
      </ScrollView>
    );
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable accessibilityLabel="Fechar" onPress={onClose} style={styles.backdrop} />
        <View style={styles.drawer}>
          <View style={styles.drawerHandleRow}>
            <View style={styles.drawerHandle} />
            <Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={onClose}>
              <Text style={styles.closeText}>Fechar</Text>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={[
              styles.drawerContent,
              { paddingBottom: 18 + insets.bottom },
            ]}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fixedPanel: {
    backgroundColor: navigationTheme.sidebarBackground,
    width: 300,
  },
  fixedPanelContent: { gap: 22, padding: 18 },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    backgroundColor: 'rgba(2, 6, 15, 0.6)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  drawer: {
    backgroundColor: navigationTheme.sidebarBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 10,
  },
  drawerHandleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  drawerHandle: {
    backgroundColor: navigationTheme.panelBorder,
    borderRadius: 999,
    height: 4,
    width: 40,
  },
  closeText: { color: navigationTheme.accent, fontSize: 13, fontWeight: '700' },
  drawerContent: { gap: 22, padding: 18 },
});
