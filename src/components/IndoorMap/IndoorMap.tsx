import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Rect, Text as SvgText } from 'react-native-svg';

import type { IndoorMapData, MapCoordinate, MapRoom } from '../../types/indoorMap';
import { Door } from './Door';
import { FloorSelector } from './FloorSelector';
import { MapControls } from './MapControls';
import { MapMarker } from './MapMarker';
import { RoomShape } from './RoomShape';
import { RouteLine } from './RouteLine';
import { Wall } from './Wall';

type IndoorMapProps = {
  map: IndoorMapData;
  routeKey: string;
  destinationFloorId: string;
  destinationRoomCode: string;
  userPosition?: MapCoordinate;
  onRoomPress?: (room: MapRoom) => void;
};

export function IndoorMap({
  map,
  routeKey,
  destinationFloorId,
  destinationRoomCode,
  userPosition,
  onRoomPress,
}: IndoorMapProps) {
  const route = map.routes[routeKey];
  const [selectedFloorId, setSelectedFloorId] = useState(destinationFloorId);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const horizontalScroll = useRef<ScrollView | null>(null);
  const verticalScroll = useRef<ScrollView | null>(null);

  useEffect(() => {
    // Keep the visible floor aligned with a new route destination.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedFloorId(destinationFloorId);
  }, [destinationFloorId]);

  const floor = map.floors.find((item) => item.id === selectedFloorId) ?? map.floors[0];
  const points = route?.pointsByFloor[floor.id] ?? [];
  const destination = floor.rooms.find((room) => room.code === destinationRoomCode);
  const isDestinationFloor = floor.id === destinationFloorId;
  const isOriginFloor = floor.id === route?.originFloorId;

  function centerMap() {
    horizontalScroll.current?.scrollTo({ x: 160 * scale, animated: true });
    verticalScroll.current?.scrollTo({ y: 130 * scale, animated: true });
  }

  return (
    <View style={styles.container}>
      <FloorSelector
        floors={map.floors}
        selectedFloorId={selectedFloorId}
        onSelect={setSelectedFloorId}
      />
      <View style={styles.mapFrame}>
        <ScrollView
          ref={horizontalScroll}
          horizontal
          contentContainerStyle={{ width: floor.width * scale }}
          showsHorizontalScrollIndicator={false}
        >
          <ScrollView
            ref={verticalScroll}
            contentContainerStyle={{ height: floor.height * scale }}
            showsVerticalScrollIndicator={false}
          >
            <Svg
              width={floor.width * scale}
              height={floor.height * scale}
              viewBox={`0 0 ${floor.width} ${floor.height}`}
            >
              <Rect width={floor.width} height={floor.height} fill="#171A1E" />
              <Rect x={50} y={270} width={820} height={50} fill="#35424A" />
              <Rect x={330} y={50} width={210} height={570} fill="#35424A" />
              {floor.rooms.map((room) => (
                <RoomShape
                  key={room.id}
                  room={room}
                  selected={room.id === selectedRoomId || (selectedRoomId === null && room.code === destinationRoomCode)}
                  onPress={() => {
                    setSelectedRoomId(room.id);
                    onRoomPress?.(room);
                  }}
                />
              ))}
              {floor.walls.map((wall, index) => <Wall key={`wall-${index}`} wall={wall} />)}
              {floor.doors.map((door) => <Door key={door.id} door={door} />)}
              {points.length > 1 ? <RouteLine points={points} /> : null}
              {isOriginFloor && points[0] ? (
                <MapMarker position={points[0]} label="Entrada" color="#0F766E" />
              ) : null}
              {isDestinationFloor && destination ? (
                <MapMarker
                  position={{
                    x: destination.position.x + destination.width / 2,
                    y: destination.position.y + destination.height,
                  }}
                  label={destination.code}
                  color="#DC2626"
                />
              ) : null}
              {userPosition && isOriginFloor ? (
                <MapMarker position={userPosition} label="Você está aqui" color="#F59E0B" />
              ) : null}
              {floor.waypoints.map((waypoint) => (
                <G key={waypoint.id}>
                  <Circle cx={waypoint.position.x} cy={waypoint.position.y} r={10} fill="#F59E0B" stroke="#FFFFFF" strokeWidth={4} />
                  <SvgText x={waypoint.position.x} y={waypoint.position.y + 30} fill="#334155" fontSize="14" fontWeight="700" textAnchor="middle">
                    {waypoint.label}
                  </SvgText>
                </G>
              ))}
            </Svg>
          </ScrollView>
        </ScrollView>
        <MapControls
          onZoomIn={() => setScale((current) => Math.min(1.8, current + 0.2))}
          onZoomOut={() => setScale((current) => Math.max(0.7, current - 0.2))}
          onCenter={centerMap}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  mapFrame: { backgroundColor: '#171A1E', borderRadius: 16, height: 380, overflow: 'hidden', position: 'relative' },
});
