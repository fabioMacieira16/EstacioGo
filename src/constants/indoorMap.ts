import type { IndoorMapData } from '../types/indoorMap';

const entrance = { x: 86, y: 610 };
const elevator = { x: 250, y: 490 };
const stairs = { x: 720, y: 490 };

export const campusIndoorMap: IndoorMapData = {
  id: 'campus-principal-mock',
  name: 'Campus Principal (planta demonstrativa)',
  floors: [
    {
      id: 'ground-floor',
      number: 0,
      label: 'Térreo',
      width: 1000,
      height: 700,
      rooms: [
        { id: 'reception', code: 'RECEPÇÃO', name: 'Recepção', position: { x: 45, y: 545 }, width: 180, height: 80, accessible: true },
        { id: 'library-ground', code: 'BIBLIOTECA', name: 'Biblioteca', position: { x: 70, y: 85 }, width: 260, height: 120, accessible: true },
        { id: 'common-ground', code: 'HUB', name: 'Área comum', position: { x: 600, y: 85 }, width: 260, height: 120, accessible: true },
      ],
      walls: [
        { start: { x: 35, y: 35 }, end: { x: 900, y: 35 } },
        { start: { x: 900, y: 35 }, end: { x: 900, y: 650 } },
        { start: { x: 900, y: 650 }, end: { x: 35, y: 650 } },
        { start: { x: 35, y: 650 }, end: { x: 35, y: 35 } },
        { start: { x: 35, y: 250 }, end: { x: 900, y: 250 } },
        { start: { x: 370, y: 35 }, end: { x: 370, y: 250 } },
        { start: { x: 520, y: 35 }, end: { x: 520, y: 250 } },
      ],
      doors: [
        { id: 'ground-entrance', position: entrance, orientation: 'vertical' },
        { id: 'ground-elevator', position: elevator, orientation: 'horizontal' },
      ],
      waypoints: [
        { id: 'main-entrance', label: 'Entrada Principal', type: 'entrance', position: entrance },
        { id: 'ground-elevator', label: 'Elevador', type: 'elevator', position: elevator },
        { id: 'ground-stairs', label: 'Escada', type: 'stairs', position: stairs },
      ],
    },
    {
      id: 'first-floor',
      number: 1,
      label: '1º andar',
      width: 1000,
      height: 700,
      rooms: [
        { id: 'f101', code: 'F101', name: 'Sala F101', position: { x: 735, y: 175 }, width: 150, height: 120, accessible: true },
        { id: 'f102', code: 'F102', name: 'Sala F102', position: { x: 545, y: 175 }, width: 150, height: 120, accessible: true },
        { id: 'library-first', code: 'BIBLIOTECA', name: 'Biblioteca', position: { x: 70, y: 85 }, width: 260, height: 120, accessible: true },
      ],
      walls: [
        { start: { x: 35, y: 35 }, end: { x: 900, y: 35 } },
        { start: { x: 900, y: 35 }, end: { x: 900, y: 650 } },
        { start: { x: 900, y: 650 }, end: { x: 35, y: 650 } },
        { start: { x: 35, y: 650 }, end: { x: 35, y: 35 } },
        { start: { x: 35, y: 330 }, end: { x: 900, y: 330 } },
        { start: { x: 370, y: 35 }, end: { x: 370, y: 330 } },
        { start: { x: 520, y: 35 }, end: { x: 520, y: 330 } },
        { start: { x: 700, y: 35 }, end: { x: 700, y: 330 } },
      ],
      doors: [
        { id: 'first-elevator', position: elevator, orientation: 'horizontal' },
        { id: 'first-stairs', position: stairs, orientation: 'horizontal' },
        { id: 'f101-door', position: { x: 735, y: 330 }, orientation: 'horizontal' },
      ],
      waypoints: [
        { id: 'first-elevator', label: 'Elevador', type: 'elevator', position: elevator },
        { id: 'first-stairs', label: 'Escada', type: 'stairs', position: stairs },
      ],
    },
  ],
  routes: {
    f101: {
      originFloorId: 'ground-floor',
      destinationFloorId: 'first-floor',
      pointsByFloor: {
        'ground-floor': [entrance, { x: 86, y: 490 }, { x: 250, y: 490 }],
        'first-floor': [elevator, { x: 250, y: 390 }, { x: 460, y: 390 }, { x: 460, y: 330 }, { x: 735, y: 330 }, { x: 810, y: 295 }],
      },
      distanceMeters: 86,
      estimatedTimeMinutes: 1,
    },
  },
};
