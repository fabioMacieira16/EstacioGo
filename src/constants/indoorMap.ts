import type { IndoorMapData } from '../types/indoorMap';

const entrance = { x: 86, y: 610 };
const elevator = { x: 250, y: 490 };
const stairs = { x: 720, y: 490 };
const blocoDEntrance = { x: 60, y: 200 };

export const campusIndoorMap: IndoorMapData = {
  id: 'campus-principal-mock',
  name: 'Campus Principal (planta demonstrativa)',
  floors: [
    {
      // Térreo do Bloco Principal (recepção/administração), confirmado pelo
      // mapa tátil "Mapa Tátil - Parangaba" e pelo letreiro direcional da entrada.
      id: 'ground-floor',
      buildingId: 'A',
      number: 0,
      label: 'Térreo',
      width: 1400,
      height: 700,
      rooms: [
        { id: 'reception', code: 'RECEPÇÃO', name: 'Recepção', position: { x: 45, y: 545 }, width: 180, height: 80, accessible: true },
        { id: 'library-ground', code: 'BIBLIOTECA', name: 'Biblioteca', position: { x: 70, y: 85 }, width: 260, height: 120, accessible: true },
        { id: 'health-ground', code: 'CONSULTORIO-SAUDE', name: 'Consultório de Saúde', position: { x: 70, y: 340 }, width: 260, height: 90, accessible: true },
        { id: 'sep-ground', code: 'SEP', name: 'SEP', position: { x: 70, y: 455 }, width: 180, height: 70, accessible: true },
        { id: 'secretary-ground', code: 'SECRETARIA-ALUNOS', name: 'Secretaria de Alunos', position: { x: 270, y: 540 }, width: 210, height: 85, accessible: true },
        { id: 'coordination-ground', code: 'COORD-CURSOS', name: 'Coordenação de Cursos', position: { x: 560, y: 85 }, width: 300, height: 95, accessible: true },
        { id: 'npj-ground', code: 'NPJ', name: 'NPJ', position: { x: 560, y: 185 }, width: 150, height: 65, accessible: true },
        { id: 'naf-ground', code: 'NAF-PROJETE', name: 'NAF-Projete', position: { x: 720, y: 185 }, width: 140, height: 65, accessible: true },
        { id: 'hub-ground', code: 'HUB', name: 'HUB', position: { x: 610, y: 430 }, width: 120, height: 70, accessible: true },
        { id: 'wc-ground', code: 'WC', name: 'WC', position: { x: 740, y: 430 }, width: 75, height: 70, accessible: true },
        { id: 'family-wc-ground', code: 'WC-FAMILIA', name: 'WC Família', position: { x: 820, y: 430 }, width: 70, height: 70, accessible: true },
        { id: 'registry-ground', code: 'SALA-MATRICULA', name: 'Sala de Matrícula', position: { x: 730, y: 540 }, width: 160, height: 85, accessible: true },
        // Extensão do bloco administrativo (mesmo agrupamento de
        // Coordenação/Secretaria no letreiro direcional da entrada).
        { id: 'nae-ground', code: 'NAE', name: 'NAE', position: { x: 880, y: 85 }, width: 190, height: 75, accessible: true },
        { id: 'naap-ground', code: 'NAAP', name: 'NAAP', position: { x: 1090, y: 85 }, width: 190, height: 75, accessible: true },
        { id: 'teachers-ground', code: 'SALA-PROFESSORES', name: 'Sala de Professores', position: { x: 880, y: 170 }, width: 190, height: 75, accessible: true },
        { id: 'direction-ground', code: 'DIRECAO', name: 'Direção', position: { x: 1090, y: 170 }, width: 190, height: 75, accessible: true },
      ],
      walls: [
        { start: { x: 35, y: 35 }, end: { x: 1300, y: 35 } },
        { start: { x: 1300, y: 35 }, end: { x: 1300, y: 650 } },
        { start: { x: 1300, y: 650 }, end: { x: 35, y: 650 } },
        { start: { x: 35, y: 650 }, end: { x: 35, y: 35 } },
        { start: { x: 35, y: 250 }, end: { x: 1300, y: 250 } },
        { start: { x: 370, y: 35 }, end: { x: 370, y: 250 } },
        { start: { x: 520, y: 35 }, end: { x: 520, y: 250 } },
        { start: { x: 860, y: 35 }, end: { x: 860, y: 250 } },
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
      // 1º andar do Bloco F, acessado pela rampa/elevador a partir do térreo
      // do Bloco Principal (confirmado em vídeo).
      id: 'first-floor',
      buildingId: 'F',
      number: 1,
      label: '1º andar',
      width: 1000,
      height: 700,
      rooms: [
        { id: 'f101', code: 'F101', name: 'Lab. Informática V', position: { x: 735, y: 175 }, width: 150, height: 120, accessible: true },
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
    {
      // Térreo do Bloco D: corredor único com salas do lado direito,
      // confirmado em vídeo (placa "D" na entrada, Refeitório/Back Office e
      // laboratório de informática do LEPE/LPSS). Ainda sem rota cadastrada.
      id: 'ground-floor-d',
      buildingId: 'D',
      number: 0,
      label: 'Térreo',
      width: 1000,
      height: 400,
      rooms: [
        { id: 'refeitorio-d', code: 'REFEITORIO', name: 'Refeitório', position: { x: 100, y: 240 }, width: 220, height: 110, accessible: true },
        { id: 'back-office-d', code: 'BACK-OFFICE', name: 'Back Office', position: { x: 340, y: 240 }, width: 180, height: 110, accessible: true },
        { id: 'lab-lepe-lpss-d', code: 'LAB-LEPE-LPSS', name: 'Lab. Informática (LEPE/LPSS)', position: { x: 580, y: 240 }, width: 260, height: 110, accessible: true },
      ],
      walls: [
        { start: { x: 35, y: 35 } , end: { x: 965, y: 35 } },
        { start: { x: 965, y: 35 }, end: { x: 965, y: 365 } },
        { start: { x: 965, y: 365 }, end: { x: 35, y: 365 } },
        { start: { x: 35, y: 365 }, end: { x: 35, y: 35 } },
        { start: { x: 35, y: 220 }, end: { x: 965, y: 220 } },
      ],
      doors: [
        { id: 'ground-d-entrance', position: blocoDEntrance, orientation: 'vertical' },
      ],
      waypoints: [
        { id: 'ground-d-entrance', label: 'Entrada Bloco D', type: 'entrance', position: blocoDEntrance },
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
