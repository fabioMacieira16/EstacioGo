import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useUserLocation } from '../../hooks/useUserLocation';
import type { RoomInput } from '../../types/room';

type RoomFormProps = {
  initialValue?: RoomInput;
  onSubmit: (input: RoomInput) => Promise<void>;
};
const emptyRoom: RoomInput = {
  code: '',
  name: '',
  buildingId: '',
  floor: 0,
  description: '',
  destination: { latitude: 0, longitude: 0 },
  routeId: null,
  active: true,
};

export function RoomForm({
  initialValue = emptyRoom,
  onSubmit,
}: RoomFormProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { location, status: locationStatus } = useUserLocation();
  const update = <K extends keyof RoomInput>(
    field: K,
    fieldValue: RoomInput[K],
  ) => setValue((current) => ({ ...current, [field]: fieldValue }));

  async function submit() {
    try {
      setSaving(true);
      setError(null);
      await onSubmit(value);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível salvar.',
      );
    } finally {
      setSaving(false);
    }
  }

  function useCurrentLocation() {
    if (!location) return;
    update('destination', location);
    setError(null);
  }

  const locationButtonLabel =
    locationStatus === 'loading'
      ? 'Localizando dispositivo...'
      : locationStatus === 'permission-denied'
        ? 'Permissão de localização negada'
        : locationStatus === 'unavailable'
          ? 'Localização indisponível'
          : 'Usar minha localização atual';

  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconText}>+</Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>
            {initialValue === emptyRoom ? 'Criar nova sala' : 'Editar sala'}
          </Text>
          <Text style={styles.subtitle}>
            Preencha os dados para disponibilizar este espaço no campus.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identificação</Text>
        <View style={styles.row}>
          <Field label="Código" hint="Ex.: A101" style={styles.codeField}>
            <TextInput
              autoCapitalize="characters"
              placeholder="Código da sala"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={value.code}
              onChangeText={(input) => update('code', input)}
            />
          </Field>
          <Field label="Nome" style={styles.nameField}>
            <TextInput
              placeholder="Nome da sala"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={value.name}
              onChangeText={(input) => update('name', input)}
            />
          </Field>
        </View>
        <View style={styles.row}>
          <Field label="Bloco" style={styles.halfField}>
            <TextInput
              placeholder="Ex.: Bloco A"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={value.buildingId}
              onChangeText={(input) => update('buildingId', input)}
            />
          </Field>
          <Field label="Andar" style={styles.halfField}>
            <TextInput
              keyboardType="numeric"
              placeholder="Ex.: 1"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={String(value.floor)}
              onChangeText={(input) => update('floor', Number(input))}
            />
          </Field>
        </View>
        <Field label="Descrição" optional>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="Adicione uma descrição para ajudar os alunos"
            placeholderTextColor="#94A3B8"
            style={[styles.input, styles.descriptionInput]}
            textAlignVertical="top"
            value={value.description}
            onChangeText={(input) => update('description', input)}
          />
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localização no mapa</Text>
        <Text style={styles.sectionHint}>
          Use sua posição atual para marcar a sala no mapa ou informe os valores manualmente.
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={!location}
          onPress={useCurrentLocation}
          style={({ pressed }) => [
            styles.locationButton,
            !location && styles.locationButtonDisabled,
            pressed && location && styles.locationButtonPressed,
          ]}
        >
          <Text style={styles.locationButtonIcon}>+</Text>
          <Text style={styles.locationButtonText}>{locationButtonLabel}</Text>
        </Pressable>
        <View style={styles.row}>
          <Field label="Latitude" style={styles.halfField}>
            <TextInput
              keyboardType="numeric"
              placeholder="Ex.: -23.5505"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={String(value.destination.latitude)}
              onChangeText={(input) =>
                update('destination', {
                  ...value.destination,
                  latitude: Number(input),
                })
              }
            />
          </Field>
          <Field label="Longitude" style={styles.halfField}>
            <TextInput
              keyboardType="numeric"
              placeholder="Ex.: -46.6333"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={String(value.destination.longitude)}
              onChangeText={(input) =>
                update('destination', {
                  ...value.destination,
                  longitude: Number(input),
                })
              }
            />
          </Field>
        </View>
      </View>

      <View style={styles.activeRow}>
        <View style={styles.activeCopy}>
          <Text style={styles.activeTitle}>Sala disponível</Text>
          <Text style={styles.activeHint}>
            Salas inativas não aparecem para os alunos.
          </Text>
        </View>
        <Switch
          ios_backgroundColor="#CBD5E1"
          trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
          thumbColor={value.active ? '#0F766E' : '#F8FAFC'}
          value={value.active}
          onValueChange={(input) => update('active', input)}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={saving}
        onPress={() => void submit()}
        style={({ pressed }) => [
          styles.submitButton,
          saving && styles.submitButtonDisabled,
          pressed && styles.submitButtonPressed,
        ]}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.submitText}>
            {initialValue === emptyRoom ? 'Criar sala' : 'Salvar alterações'}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  optional?: boolean;
  style?: object;
  children: React.ReactNode;
};

function Field({ label, hint, optional, style, children }: FieldProps) {
  return (
    <View style={[styles.field, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional ? <Text style={styles.optional}>Opcional</Text> : null}
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20 },
  formHeader: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  iconBadge: {
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  iconText: { color: '#0F766E', fontSize: 26, fontWeight: '400', lineHeight: 30 },
  headerCopy: { flex: 1, gap: 3 },
  title: { color: '#0F172A', fontSize: 20, fontWeight: '800' },
  subtitle: { color: '#64748B', fontSize: 13, lineHeight: 18 },
  section: { gap: 12 },
  sectionTitle: { color: '#0F172A', fontSize: 15, fontWeight: '800' },
  sectionHint: { color: '#64748B', fontSize: 12, marginTop: -6 },
  locationButton: {
    alignItems: 'center',
    borderColor: '#99F6E4',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 12,
  },
  locationButtonDisabled: { opacity: 0.55 },
  locationButtonPressed: { backgroundColor: '#F0FDFA' },
  locationButtonIcon: { color: '#0F766E', fontSize: 20 },
  locationButtonText: { color: '#0F766E', fontSize: 13, fontWeight: '700' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  field: { flex: 1, gap: 7, minWidth: 140 },
  codeField: { flexGrow: 0.7 },
  nameField: { flexGrow: 1.3 },
  halfField: { minWidth: 120 },
  labelRow: { alignItems: 'baseline', flexDirection: 'row', gap: 7 },
  label: { color: '#334155', fontSize: 12, fontWeight: '700' },
  hint: { color: '#94A3B8', fontSize: 11 },
  optional: { color: '#94A3B8', fontSize: 11, fontStyle: 'italic' },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    color: '#0F172A',
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  descriptionInput: { minHeight: 78 },
  activeRow: {
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  activeCopy: { flex: 1, gap: 3 },
  activeTitle: { color: '#115E59', fontSize: 13, fontWeight: '800' },
  activeHint: { color: '#0F766E', fontSize: 11 },
  error: { color: '#B91C1C', fontSize: 13, fontWeight: '600' },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 46,
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonPressed: { opacity: 0.9 },
  submitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
