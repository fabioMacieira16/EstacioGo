export type MapCoordinate = {
  x: number;
  y: number;
};

export type MapRoom = {
  id: string;
  code: string;
  name: string;
  position: MapCoordinate;
  width: number;
  height: number;
  accessible: boolean;
};

export type MapWall = {
  start: MapCoordinate;
  end: MapCoordinate;
};

export type MapDoor = {
  id: string;
  position: MapCoordinate;
  orientation: 'horizontal' | 'vertical';
};

export type MapWaypoint = {
  id: string;
  label: string;
  type: 'entrance' | 'elevator' | 'stairs' | 'landmark';
  position: MapCoordinate;
};

export type IndoorFloor = {
  id: string;
  buildingId: string;
  number: number;
  label: string;
  width: number;
  height: number;
  rooms: MapRoom[];
  walls: MapWall[];
  doors: MapDoor[];
  waypoints: MapWaypoint[];
};

export type IndoorMapDocument = IndoorFloor & {
  campusId: string;
  active: boolean;
};

export type IndoorRoute = {
  originFloorId: string;
  destinationFloorId: string;
  pointsByFloor: Record<string, MapCoordinate[]>;
  distanceMeters: number;
  estimatedTimeMinutes?: number;
};

export type IndoorMapData = {
  id: string;
  name: string;
  floors: IndoorFloor[];
  routes: Record<string, IndoorRoute>;
};
