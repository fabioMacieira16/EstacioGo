import { useMemo, useRef, useState } from 'react';
import { PanResponder, Platform, ScrollView, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Svg, { Defs, G, LinearGradient, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { navigationTheme } from '../../constants/navigationTheme';
import type { IndoorFloor, IndoorRoute, MapCoordinate, MapRoom } from '../../types/indoorMap';
import { Door } from './Door';
import { FloorBadge } from './FloorBadge';
import { MapControls } from './MapControls';
import { MapMarker } from './MapMarker';
import { RoomShape } from './RoomShape';
import { RouteLine } from './RouteLine';
import { Wall } from './Wall';

type IndoorMapProps = {
  floors: IndoorFloor[];
  selectedFloorId: string;
  onSelectFloor: (floorId: string) => void;
  route: IndoorRoute | null;
  destinationRoomCode: string;
  destinationRoomName?: string;
  userPosition?: MapCoordinate;
  onRoomPress?: (room: MapRoom) => void;
};

const MIN_SCALE = 0.7;
const MAX_SCALE = 2.2;

function touchDistance(event: GestureResponderEvent): number {
  const [first, second] = event.nativeEvent.touches;
  if (!first || !second) return 0;
  return Math.hypot(first.pageX - second.pageX, first.pageY - second.pageY);
}

export function IndoorMap({
  floors,
  selectedFloorId,
  onSelectFloor,
  route,
  destinationRoomCode,
  destinationRoomName,
  userPosition,
  onRoomPress,
}: IndoorMapProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const horizontalScroll = useRef<ScrollView | null>(null);
  const verticalScroll = useRef<ScrollView | null>(null);
  const pinch = useRef({ startDistance: 0, startScale: 1 });

  const floor = floors.find((item) => item.id === selectedFloorId) ?? floors[0];

  const panResponder = useMemo(
    () =>
      // Standard React Native gesture pattern: the pinch bookkeeping ref is only
      // read inside handlers invoked later by touch events, never during render.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        // Only take over the gesture for two-finger pinches so the nested
        // ScrollViews below keep handling single-finger panning normally.
        onStartShouldSetPanResponderCapture: (event) => event.nativeEvent.touches.length === 2,
        onMoveShouldSetPanResponderCapture: (event) => event.nativeEvent.touches.length === 2,
        onPanResponderGrant: (event) => {
          pinch.current = { startDistance: touchDistance(event), startScale: scale };
        },
        onPanResponderMove: (event) => {
          if (event.nativeEvent.touches.length !== 2 || pinch.current.startDistance === 0) return;
          const ratio = touchDistance(event) / pinch.current.startDistance;
          const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinch.current.startScale * ratio));
          setScale(nextScale);
        },
      }),
    [scale],
  );

  if (!floor) return null;

  const points = route?.pointsByFloor[floor.id] ?? [];
  const destination = floor.rooms.find(
    (room) =>
      room.code === destinationRoomCode ||
      (destinationRoomName && room.name.toLowerCase() === destinationRoomName.toLowerCase()),
  );
  const isDestinationFloor = floor.id === route?.destinationFloorId;
  const isOriginFloor = floor.id === route?.originFloorId;

  function centerMap() {
    horizontalScroll.current?.scrollTo({ x: 160 * scale, animated: true });
    verticalScroll.current?.scrollTo({ y: 130 * scale, animated: true });
  }

  // PanResponder's responder props aren't consumed correctly by react-native-web
  // (it logs "Unknown event handler property" for each one). Pinch-to-zoom is
  // native-only; web/desktop keep the +/- buttons as their zoom control.
  const pinchHandlers = Platform.OS === 'web' ? {} : panResponder.panHandlers;

  return (
    <View style={styles.mapFrame} {...pinchHandlers}>
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
            <Defs>
              <LinearGradient id="roomGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#EEF3FA" />
                <Stop offset="1" stopColor="#C7D2E3" />
              </LinearGradient>
              <LinearGradient id="roomGradientSelected" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#BFF7EA" />
                <Stop offset="1" stopColor="#6FDCC4" />
              </LinearGradient>
              <LinearGradient id="wallGradientH" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#B7C0CC" />
                <Stop offset="1" stopColor="#616D7C" />
              </LinearGradient>
              <LinearGradient id="wallGradientV" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#B7C0CC" />
                <Stop offset="1" stopColor="#616D7C" />
              </LinearGradient>
              <RadialGradient id="markerGloss" cx="35%" cy="30%" r="70%">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="floorVignette" cx="50%" cy="45%" r="75%">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
                <Stop offset="1" stopColor="#94A3B8" stopOpacity="0.25" />
              </RadialGradient>
              <LinearGradient id="waypointGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#475569" />
                <Stop offset="1" stopColor="#1E293B" />
              </LinearGradient>
            </Defs>
            <Rect width={floor.width} height={floor.height} fill={navigationTheme.mapBackground} />
            <Rect width={floor.width} height={floor.height} fill="url(#floorVignette)" />
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
              <MapMarker position={points[0]} label="Entrada" color="#10B981" />
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
              <MapMarker position={userPosition} label="Você está aqui" color={navigationTheme.accent} />
            ) : null}
            {floor.waypoints.map((waypoint) => (
              <G key={waypoint.id}>
                <Rect
                  x={waypoint.position.x - 13}
                  y={waypoint.position.y - 11}
                  width={28}
                  height={28}
                  rx={7}
                  fill="#0F172A"
                  opacity={0.25}
                />
                <Rect
                  x={waypoint.position.x - 14}
                  y={waypoint.position.y - 14}
                  width={28}
                  height={28}
                  rx={7}
                  fill="url(#waypointGradient)"
                />
                <SvgText
                  x={waypoint.position.x}
                  y={waypoint.position.y + 5}
                  fill="#FFFFFF"
                  fontSize="14"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {waypoint.type === 'elevator' ? '⬍' : waypoint.type === 'stairs' ? '⚌' : '•'}
                </SvgText>
                <SvgText x={waypoint.position.x} y={waypoint.position.y + 32} fill="#334155" fontSize="13" fontWeight="700" textAnchor="middle">
                  {waypoint.label}
                </SvgText>
              </G>
            ))}
          </Svg>
        </ScrollView>
      </ScrollView>
      <FloorBadge floors={floors} selectedFloorId={floor.id} onSelect={onSelectFloor} />
      <MapControls
        onZoomIn={() => setScale((current) => Math.min(MAX_SCALE, current + 0.2))}
        onZoomOut={() => setScale((current) => Math.max(MIN_SCALE, current - 0.2))}
        onCenter={centerMap}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapFrame: {
    backgroundColor: navigationTheme.mapBackground,
    borderRadius: 16,
    flex: 1,
    minHeight: 380,
    overflow: 'hidden',
    position: 'relative',
  },
});
