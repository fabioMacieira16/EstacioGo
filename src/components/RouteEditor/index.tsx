import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DEFAULT_CAMPUS_ID, DEFAULT_MAP_ORIGIN } from '../../constants/map';
import { navigationTheme } from '../../constants/navigationTheme';
import type { Coordinates } from '../../types/coordinates';
import type { RouteInput } from '../../types/route';
import { CampusMap } from '../CampusMap';

type RouteEditorProps = {
  onSave: (route: RouteInput) => Promise<void>;
};

type EditorMode = 'origin' | 'intermediate' | 'destination';

export function RouteEditor({ onSave }: RouteEditorProps) {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState<Coordinates>(DEFAULT_MAP_ORIGIN);
  const [destination, setDestination] =
    useState<Coordinates>(DEFAULT_MAP_ORIGIN);
  const [points, setPoints] = useState<Coordinates[]>([]);
  const [mode, setMode] = useState<EditorMode>('origin');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const routeCoordinates = [origin, ...points, destination];

  function handleMapPress(coordinate: Coordinates) {
    if (mode === 'origin') setOrigin(coordinate);
    if (mode === 'destination') setDestination(coordinate);
    if (mode === 'intermediate')
      setPoints((current) => [...current, coordinate]);
  }

  function clearRoute() {
    setOrigin(DEFAULT_MAP_ORIGIN);
    setDestination(DEFAULT_MAP_ORIGIN);
    setPoints([]);
    setMode('origin');
    setError(null);
  }

  async function save() {
    try {
      setSaving(true);
      setError(null);
      await onSave({
        campusId: DEFAULT_CAMPUS_ID,
        name,
        origin,
        destination,
        coordinates: routeCoordinates,
        active: true,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Não foi possível salvar a rota.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Identificação da rota</Text>
      <TextInput
        placeholderTextColor="#94A3B8"
        placeholder="Nome da rota"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <View style={styles.mapSection}>
        <View style={styles.mapHeader}>
          <View style={styles.mapCopy}>
            <Text style={styles.sectionTitle}>Desenhe o caminho</Text>
            <Text style={styles.helperText}>
              Escolha um modo e toque no mapa para posicionar cada ponto.
            </Text>
          </View>
          <Text style={styles.pointCount}>{routeCoordinates.length} pontos</Text>
        </View>
        <View style={styles.modeRow}>
          <ModeButton
            active={mode === 'origin'}
            label="Origem"
            onPress={() => setMode('origin')}
          />
          <ModeButton
            active={mode === 'intermediate'}
            label="Ponto"
            onPress={() => setMode('intermediate')}
          />
          <ModeButton
            active={mode === 'destination'}
            label="Destino"
            onPress={() => setMode('destination')}
          />
        </View>
        <Text style={styles.modeStatus}>
          Modo selecionado: {mode === 'origin' ? 'origem' : mode === 'destination' ? 'destino' : 'ponto intermediário'}
        </Text>
        <CampusMap
          origin={origin}
          destination={destination}
          routeCoordinates={routeCoordinates}
          onMapPress={handleMapPress}
        />
      </View>

      <View style={styles.pointsSection}>
        <Text style={styles.sectionTitle}>Pontos da rota</Text>
      {routeCoordinates.map((coordinate, index) => (
        <View style={styles.pointRow} key={`${coordinate.latitude}-${coordinate.longitude}-${index}`}>
          <View style={styles.pointCopy}>
            <Text style={styles.pointName}>
            {index === 0
              ? 'Origem'
              : index === routeCoordinates.length - 1
                ? 'Destino'
                : `Ponto ${index}`}
            </Text>
            <Text style={styles.coordinates}>
              {coordinate.latitude.toFixed(6)}, {coordinate.longitude.toFixed(6)}
            </Text>
          </View>
          {index > 0 && index < routeCoordinates.length - 1 ? (
            <ActionButton
              label="Remover"
              variant="danger"
              onPress={() =>
                setPoints((current) =>
                  current.filter((_, pointIndex) => pointIndex !== index - 1),
                )
              }
            />
          ) : null}
        </View>
      ))}
      </View>
      {error ? <Text>{error}</Text> : null}
      <View style={styles.footerActions}>
        <ActionButton label="Limpar rota" onPress={clearRoute} variant="muted" />
        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={() => void save()}
          style={({ pressed }) => [
            styles.saveButton,
            saving && styles.disabledButton,
            pressed && styles.pressedButton,
          ]}
        >
          {saving ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.saveText}>Salvar rota</Text>}
        </Pressable>
      </View>
    </View>
  );
}

function ModeButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.modeButton, active && styles.activeModeButton]}>
      <Text style={[styles.modeButtonText, active && styles.activeModeButtonText]}>{label}</Text>
    </Pressable>
  );
}

function ActionButton({ label, onPress, variant }: { label: string; onPress: () => void; variant: 'danger' | 'muted' }) {
  return (
    <Pressable onPress={onPress} style={[styles.actionButton, variant === 'danger' ? styles.dangerButton : styles.mutedButton]}>
      <Text style={[styles.actionText, variant === 'danger' ? styles.dangerText : styles.mutedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: 18 },
  sectionTitle: { color: navigationTheme.textPrimary, fontSize: 15, fontWeight: '800' },
  input: {
    backgroundColor: '#FFFFFF', borderColor: navigationTheme.panelBorder, borderRadius: 10,
    borderWidth: 1, color: '#0F172A', fontSize: 14, minHeight: 44,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  mapSection: { gap: 12 },
  mapHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  mapCopy: { flex: 1, gap: 4 },
  helperText: { color: navigationTheme.textSecondary, fontSize: 12, lineHeight: 17 },
  pointCount: { color: navigationTheme.accent, fontSize: 12, fontWeight: '800' },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeButton: { backgroundColor: navigationTheme.sidebarBackground, borderRadius: 9, flex: 1, paddingVertical: 10 },
  activeModeButton: { backgroundColor: navigationTheme.accent },
  modeButtonText: { color: navigationTheme.textSecondary, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  activeModeButtonText: { color: navigationTheme.textOnAccent },
  modeStatus: { color: navigationTheme.textSecondary, fontSize: 12 },
  pointsSection: { gap: 10 },
  pointRow: { alignItems: 'center', backgroundColor: navigationTheme.sidebarBackground, borderColor: navigationTheme.panelBorder, borderRadius: 10, borderWidth: 1, flexDirection: 'row', gap: 10, justifyContent: 'space-between', padding: 10 },
  pointCopy: { flex: 1, gap: 3 },
  pointName: { color: navigationTheme.textPrimary, fontSize: 13, fontWeight: '700' },
  coordinates: { color: navigationTheme.textSecondary, fontSize: 11 },
  actionButton: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  dangerButton: { backgroundColor: 'rgba(248, 113, 113, 0.16)' },
  mutedButton: { backgroundColor: navigationTheme.sidebarBackground },
  actionText: { fontSize: 12, fontWeight: '700' },
  dangerText: { color: '#F87171' },
  mutedText: { color: navigationTheme.textSecondary },
  footerActions: { flexDirection: 'row', gap: 10 },
  saveButton: { alignItems: 'center', backgroundColor: navigationTheme.accent, borderRadius: 10, flex: 1, justifyContent: 'center', minHeight: 44 },
  saveText: { color: navigationTheme.textOnAccent, fontSize: 14, fontWeight: '800' },
  disabledButton: { opacity: 0.7 },
  pressedButton: { opacity: 0.9 },
});
