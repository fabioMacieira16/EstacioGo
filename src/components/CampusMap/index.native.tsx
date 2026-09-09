import { useCallback, useEffect, useRef, type ComponentRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NativeMapView, { Marker, Polyline } from 'react-native-maps';

import { DEFAULT_MAP_ORIGIN, DEFAULT_MAP_REGION } from '../../constants/map';
import type { Coordinates } from '../../types/coordinates';

export type CampusMapProps = {
  origin: Coordinates;
  destination: Coordinates;
  routeCoordinates: Coordinates[];
  userLocation?: Coordinates;
  onMapPress?: (coordinate: Coordinates) => void;
  originFloor?: number;
  destinationFloor?: number;
};

export function CampusMap({
  origin,
  destination,
  routeCoordinates,
  userLocation,
  onMapPress,
  originFloor = 0,
  destinationFloor = 0,
}: CampusMapProps) {
  const mapRef = useRef<ComponentRef<typeof NativeMapView> | null>(null);
  const fitRoute = useCallback(() => {
    mapRef.current?.fitToCoordinates(
      [origin, ...routeCoordinates, destination],
      {
        edgePadding: { top: 80, right: 48, bottom: 80, left: 48 },
        animated: true,
      },
    );
  }, [origin, routeCoordinates, destination]);

  useEffect(() => {
    fitRoute();
  }, [fitRoute]);

  return (
    <View style={styles.container}>
      {destinationFloor !== originFloor ? (
        <View style={styles.transitionBanner}>
          <Text style={styles.transitionTitle}>Destino no {destinationFloor}º andar</Text>
          <Text style={styles.transitionText}>
            Use a escada ou o elevador para continuar a rota.
          </Text>
        </View>
      ) : null}
      <NativeMapView ref={mapRef} style={styles.map} initialRegion={DEFAULT_MAP_REGION} onMapReady={fitRoute} onPress={onMapPress ? (event) => onMapPress(event.nativeEvent.coordinate) : undefined} showsCompass showsUserLocation={false}>
      <Marker coordinate={origin} title="Origem" pinColor="#2563EB" />
      <Marker coordinate={destination} title="Destino" pinColor="#DC2626" />
      {routeCoordinates.slice(1, -1).map((coordinate, index) => (
        <Marker
          key={`${coordinate.latitude}-${coordinate.longitude}-${index}`}
          coordinate={coordinate}
          title={`Ponto intermediário ${index + 1}`}
          pinColor="#7C3AED"
        />
      ))}
      <Marker
        coordinate={DEFAULT_MAP_ORIGIN}
        title="Faculdade"
        description="Localização da faculdade"
        pinColor="#0F766E"
      />
      {userLocation ? (
        <Marker coordinate={userLocation} title="Sua localização" pinColor="#F59E0B" />
      ) : null}
      {routeCoordinates.length > 1 ? (
        <Polyline coordinates={routeCoordinates} strokeColor="#2563EB" strokeWidth={5} />
      ) : null}
      </NativeMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  transitionBanner: { backgroundColor: '#ECFDF5', borderColor: '#99F6E4', borderRadius: 10, borderWidth: 1, padding: 12 },
  transitionTitle: { color: '#115E59', fontSize: 14, fontWeight: '800' },
  transitionText: { color: '#336B68', fontSize: 12, marginTop: 3 },
  map: {
    minHeight: 320,
    width: '100%',
  },
});