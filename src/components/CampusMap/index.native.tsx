import { useCallback, useEffect, useRef, type ComponentRef } from 'react';
import { StyleSheet } from 'react-native';
import NativeMapView, { Marker, Polyline } from 'react-native-maps';

import { DEFAULT_MAP_ORIGIN, DEFAULT_MAP_REGION } from '../../constants/map';
import type { Coordinates } from '../../types/coordinates';

export type CampusMapProps = {
  origin: Coordinates;
  destination: Coordinates;
  routeCoordinates: Coordinates[];
  userLocation?: Coordinates;
  onMapPress?: (coordinate: Coordinates) => void;
};

export function CampusMap({
  origin,
  destination,
  routeCoordinates,
  userLocation,
  onMapPress,
}: CampusMapProps) {
  const mapRef = useRef<ComponentRef<typeof NativeMapView> | null>(null);
  const fitRoute = useCallback(() => {
    mapRef.current?.fitToCoordinates(
      [origin, ...routeCoordinates, destination, ...(userLocation ? [userLocation] : [])],
      {
        edgePadding: { top: 80, right: 48, bottom: 80, left: 48 },
        animated: true,
      },
    );
  }, [origin, routeCoordinates, destination, userLocation]);

  useEffect(() => {
    fitRoute();
  }, [fitRoute]);

  return (
    <NativeMapView
      ref={mapRef}
      style={styles.map}
      initialRegion={DEFAULT_MAP_REGION}
      onMapReady={fitRoute}
      onPress={
        onMapPress
          ? (event) => onMapPress(event.nativeEvent.coordinate)
          : undefined
      }
      showsCompass
      showsUserLocation={false}
    >
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
  );
}

const styles = StyleSheet.create({
  map: {
    minHeight: 320,
    width: '100%',
  },
});