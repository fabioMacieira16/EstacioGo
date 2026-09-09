import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Coordinates } from '../../types/coordinates';

const orientationPoints = [
  { id: 'library', label: 'Biblioteca', x: 31, y: 27 },
  { id: 'health', label: 'Consultório de saúde', x: 27, y: 38 },
  { id: 'coordination', label: 'Coord. de cursos', x: 59, y: 27 },
  { id: 'npi', label: 'NPI', x: 59, y: 43 },
  { id: 'naf', label: 'NAF-Projete', x: 57, y: 52 },
  { id: 'elevator', label: 'Elevador', x: 35, y: 63 },
  { id: 'polo', label: 'Polo EAD', x: 47, y: 63 },
  { id: 'wc', label: 'WC', x: 54, y: 63 },
  { id: 'hub', label: 'HUB', x: 70, y: 52 },
  { id: 'registry', label: 'Sala de matrícula', x: 74, y: 68 },
  { id: 'entrance', label: 'Entrada', x: 87, y: 61 },
];

export type CampusMapProps = {
  origin: Coordinates;
  destination: Coordinates;
  routeCoordinates: Coordinates[];
  userLocation?: Coordinates;
  originFloor?: number;
  destinationFloor?: number;
};

export function CampusMap({
  origin,
  destination,
  routeCoordinates,
  userLocation,
  originFloor = 0,
  destinationFloor = 0,
}: CampusMapProps) {
  const [selectedFloor, setSelectedFloor] = useState(destinationFloor);
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
    x: Math.min(92, Math.max(8, ((point.longitude - minLongitude) / longitudeRange) * 76 + 12)),
    y: Math.min(86, Math.max(14, (1 - (point.latitude - minLatitude) / latitudeRange) * 72 + 14)),
  });
  const positions = routeCoordinates.map(toPosition);
  const userPosition = userLocation ? toPosition(userLocation) : undefined;
  const floorChange = destinationFloor !== originFloor;
  const floorLabel = selectedFloor === 0 ? 'Térreo' : `${selectedFloor}º andar`;

  return (
    <View style={styles.mapSection}>
      <View style={styles.floorHeader}>
        <View>
          <Text style={styles.mapTitle}>Orientação por andar</Text>
          <Text style={styles.mapSubtitle}>
            {floorChange
              ? `Suba para o ${destinationFloor}º andar para chegar à sala.`
              : 'Você está no mesmo andar do destino.'}
          </Text>
        </View>
        <View style={styles.floorSwitcher}>
          {[originFloor, destinationFloor]
            .filter((floor, index, floors) => floors.indexOf(floor) === index)
            .sort((first, second) => first - second)
            .map((floor) => (
              <Pressable
                key={floor}
                accessibilityRole="button"
                accessibilityLabel={`Ver ${floor === 0 ? 'térreo' : `${floor}º andar`}`}
                onPress={() => setSelectedFloor(floor)}
                style={[styles.floorButton, selectedFloor === floor && styles.floorButtonActive]}
              >
                <Text style={[styles.floorButtonText, selectedFloor === floor && styles.floorButtonTextActive]}>
                  {floor === 0 ? 'Térreo' : `${floor}º andar`}
                </Text>
              </Pressable>
            ))}
        </View>
      </View>
      {floorChange ? (
        <View style={styles.transitionBanner}>
          <Text style={styles.transitionIcon}>↑</Text>
          <View>
            <Text style={styles.transitionTitle}>Mudança de andar</Text>
            <Text style={styles.transitionText}>
              Use a escada ou o elevador indicado para continuar até o destino.
            </Text>
          </View>
        </View>
      ) : null}
      <View
        style={styles.webMap}
        onLayout={(event) => setSize(event.nativeEvent.layout)}
      >
      <ImageBackground
        source={require('../../../Documentation/mapa_da_faculdade.jpeg')}
        resizeMode="contain"
        style={styles.webMapImage}
        imageStyle={styles.webMapImageStyle}
        accessibilityLabel="Mapa de referência do campus"
      >
        <View style={styles.mapWash} />
        <View style={styles.floorPill}>
          <Text style={styles.floorPillText}>{floorLabel}</Text>
        </View>
        {orientationPoints.map((point) => (
          <View
            key={point.id}
            style={[styles.orientationPoint, { left: `${point.x}%`, top: `${point.y}%` }]}
          >
            <View style={styles.orientationDot} />
            <Text style={styles.orientationLabel}>{point.label}</Text>
          </View>
        ))}
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
        {selectedFloor === originFloor ? (
          <WebMarker position={toPosition(origin)} label="Origem" color="#2563EB" />
        ) : null}
        {selectedFloor === destinationFloor ? (
          <WebMarker position={toPosition(destination)} label="Destino" color="#DC2626" />
        ) : null}
        {userPosition ? (
          <WebMarker position={userPosition} label="Você está aqui" color="#F59E0B" />
        ) : null}
        <View style={styles.mapBadge}>
          <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
          <Text style={styles.mapBadgeText}>Rota para a sala</Text>
        </View>
      </ImageBackground>
      </View>
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
  mapSection: { gap: 12 },
  floorHeader: { gap: 12 },
  mapTitle: { color: '#0F172A', fontSize: 18, fontWeight: '800' },
  mapSubtitle: { color: '#64748B', fontSize: 13, lineHeight: 19, marginTop: 3 },
  floorSwitcher: { flexDirection: 'row', gap: 8 },
  floorButton: { backgroundColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9 },
  floorButtonActive: { backgroundColor: '#0F766E' },
  floorButtonText: { color: '#334155', fontSize: 13, fontWeight: '700' },
  floorButtonTextActive: { color: '#FFFFFF' },
  transitionBanner: { alignItems: 'center', backgroundColor: '#ECFDF5', borderColor: '#99F6E4', borderRadius: 10, borderWidth: 1, flexDirection: 'row', gap: 10, padding: 12 },
  transitionIcon: { color: '#0F766E', fontSize: 28, fontWeight: '800' },
  transitionTitle: { color: '#115E59', fontSize: 14, fontWeight: '800' },
  transitionText: { color: '#336B68', fontSize: 12, lineHeight: 17, marginTop: 2 },
  webMap: { borderRadius: 18, minHeight: 360, overflow: 'hidden', width: '100%' },
  webMapImage: { flex: 1, minHeight: 360, position: 'relative' },
  webMapImageStyle: { opacity: 0.86 },
  mapWash: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(248, 250, 252, 0.35)' },
  webRouteSegment: { backgroundColor: '#2563EB', height: 6, position: 'absolute', transformOrigin: 'left center' },
  webMarker: { alignItems: 'center', position: 'absolute', transform: [{ translateX: -12 }, { translateY: -12 }] },
  webMarkerDot: { borderColor: '#FFFFFF', borderRadius: 12, borderWidth: 3, height: 24, shadowColor: '#0F172A', shadowOpacity: 0.22, shadowRadius: 5, width: 24 },
  webMarkerLabel: { backgroundColor: '#FFFFFF', borderRadius: 5, color: '#0F172A', fontSize: 11, fontWeight: '700', marginTop: 5, paddingHorizontal: 7, paddingVertical: 4 },
  orientationPoint: { alignItems: 'center', position: 'absolute', transform: [{ translateX: -5 }, { translateY: -5 }] },
  orientationDot: { backgroundColor: '#F59E0B', borderColor: '#FFFFFF', borderRadius: 5, borderWidth: 1, height: 10, width: 10 },
  orientationLabel: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 4, color: '#334155', fontSize: 9, fontWeight: '700', marginTop: 3, paddingHorizontal: 4, paddingVertical: 2 },
  mapBadge: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 8, flexDirection: 'row', gap: 7, left: 16, paddingHorizontal: 10, paddingVertical: 8, position: 'absolute', top: 16 },
  legendDot: { borderRadius: 5, height: 10, width: 10 },
  mapBadgeText: { color: '#334155', fontSize: 12, fontWeight: '700' },
  floorPill: { backgroundColor: '#0F172A', borderRadius: 8, left: 16, paddingHorizontal: 10, paddingVertical: 7, position: 'absolute', top: 16, zIndex: 2 },
  floorPillText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});