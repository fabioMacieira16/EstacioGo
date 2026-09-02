import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import type { Coordinates } from '../../types/coordinates';

export type CampusMapProps = {
  origin: Coordinates;
  destination: Coordinates;
  routeCoordinates: Coordinates[];
  userLocation?: Coordinates;
};

export function CampusMap({
  origin,
  destination,
  routeCoordinates,
  userLocation,
}: CampusMapProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const points = [origin, ...routeCoordinates, destination];
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const latitudeRange = Math.max(maxLatitude - minLatitude, 0.000001);
  const longitudeRange = Math.max(maxLongitude - minLongitude, 0.000001);
  const toPosition = (point: Coordinates) => ({
    x: ((point.longitude - minLongitude) / longitudeRange) * 76 + 12,
    y: (1 - (point.latitude - minLatitude) / latitudeRange) * 72 + 14,
  });
  const positions = routeCoordinates.map(toPosition);
  const userPosition = userLocation ? toPosition(userLocation) : undefined;

  return (
    <View
      style={styles.webMap}
      onLayout={(event) => setSize(event.nativeEvent.layout)}
    >
      <ImageBackground
        source={require('../../../Documentation/mapa_da_faculdade.jpeg')}
        resizeMode="cover"
        style={styles.webMapImage}
        imageStyle={styles.webMapImageStyle}
        accessibilityLabel="Mapa de referência do campus"
      >
        <View style={styles.mapWash} />
        {positions.slice(1).map((position, index) => {
          const previous = positions[index];
          const deltaX = (position.x - previous.x) * size.width / 100;
          const deltaY = (position.y - previous.y) * size.height / 100;
          const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
          const angle = Math.atan2(deltaY, deltaX);
          return (
            <View
              key={`segment-${index}`}
              style={[
                styles.webRouteSegment,
                {
                  left: `${previous.x}%`,
                  top: `${previous.y}%`,
                  transform: [{ translateY: -3 }, { rotate: `${angle}rad` }],
                  width: length,
                },
              ]}
            />
          );
        })}
        <WebMarker position={toPosition(origin)} label="Origem" color="#2563EB" />
        <WebMarker position={toPosition(destination)} label="Destino" color="#DC2626" />
        {userPosition ? (
          <WebMarker position={userPosition} label="Você está aqui" color="#F59E0B" />
        ) : null}
        <View style={styles.mapBadge}>
          <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
          <Text style={styles.mapBadgeText}>Rota para a sala</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

function WebMarker({
  position,
  label,
  color,
}: {
  position: { x: number; y: number };
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.webMarker, { left: `${position.x}%`, top: `${position.y}%` }]}>
      <View style={[styles.webMarkerDot, { backgroundColor: color }]} />
      <Text style={styles.webMarkerLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webMap: { borderRadius: 18, minHeight: 360, overflow: 'hidden', width: '100%' },
  webMapImage: { flex: 1, minHeight: 360, position: 'relative' },
  webMapImageStyle: { opacity: 0.86 },
  mapWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(248, 250, 252, 0.35)' },
  webRouteSegment: { backgroundColor: '#2563EB', height: 6, position: 'absolute', transformOrigin: 'left center' },
  webMarker: { alignItems: 'center', position: 'absolute', transform: [{ translateX: -12 }, { translateY: -12 }] },
  webMarkerDot: { borderColor: '#FFFFFF', borderRadius: 12, borderWidth: 3, height: 24, shadowColor: '#0F172A', shadowOpacity: 0.22, shadowRadius: 5, width: 24 },
  webMarkerLabel: { backgroundColor: '#FFFFFF', borderRadius: 5, color: '#0F172A', fontSize: 11, fontWeight: '700', marginTop: 5, paddingHorizontal: 7, paddingVertical: 4 },
  mapBadge: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 8, flexDirection: 'row', gap: 7, left: 16, paddingHorizontal: 10, paddingVertical: 8, position: 'absolute', top: 16 },
  legendDot: { borderRadius: 5, height: 10, width: 10 },
  mapBadgeText: { color: '#334155', fontSize: 12, fontWeight: '700' },
});