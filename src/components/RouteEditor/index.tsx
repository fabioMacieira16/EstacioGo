import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

import { DEFAULT_MAP_ORIGIN } from '../../constants/map';
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
        campusId: 'campus-principal',
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
    <View>
      <TextInput
        placeholder="Nome da rota"
        value={name}
        onChangeText={setName}
      />
      <Text>
        Modo atual:{' '}
        {mode === 'origin'
          ? 'origem'
          : mode === 'destination'
            ? 'destino'
            : 'ponto intermediário'}
      </Text>
      <Button title="Definir origem" onPress={() => setMode('origin')} />
      <Button
        title="Adicionar ponto intermediário"
        onPress={() => setMode('intermediate')}
      />
      <Button title="Definir destino" onPress={() => setMode('destination')} />
      <CampusMap
        origin={origin}
        destination={destination}
        routeCoordinates={routeCoordinates}
        onMapPress={handleMapPress}
      />
      <Text>Pontos da rota: {routeCoordinates.length}</Text>
      {routeCoordinates.map((coordinate, index) => (
        <View key={`${coordinate.latitude}-${coordinate.longitude}-${index}`}>
          <Text>
            {index === 0
              ? 'Origem'
              : index === routeCoordinates.length - 1
                ? 'Destino'
                : `Ponto ${index}`}
            : {coordinate.latitude.toFixed(6)},{' '}
            {coordinate.longitude.toFixed(6)}
          </Text>
          {index > 0 && index < routeCoordinates.length - 1 ? (
            <Button
              title="Remover ponto"
              onPress={() =>
                setPoints((current) =>
                  current.filter((_, pointIndex) => pointIndex !== index - 1),
                )
              }
            />
          ) : null}
        </View>
      ))}
      {error ? <Text>{error}</Text> : null}
      <Button title="Limpar rota" onPress={clearRoute} />
      <Button
        title={saving ? 'Salvando...' : 'Salvar rota'}
        onPress={() => void save()}
        disabled={saving}
      />
    </View>
  );
}
