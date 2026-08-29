import type { RoomInput } from '../types/room';

export function normalizeRoomCode(value: string): string {
  return value.trim().toUpperCase();
}

export function validateRoomInput(input: RoomInput): void {
  if (!normalizeRoomCode(input.code))
    throw new Error('Código da sala é obrigatório.');
  if (!input.name.trim()) throw new Error('Nome da sala é obrigatório.');
  if (!input.buildingId.trim()) throw new Error('Bloco é obrigatório.');
  if (!Number.isInteger(input.floor))
    throw new Error('Andar deve ser um número inteiro.');
  if (!input.description.trim()) throw new Error('Descrição é obrigatória.');
  if (input.routeId !== null && !input.routeId.trim())
    throw new Error('Rota deve ser válida.');
  if (
    !Number.isFinite(input.destination.latitude) ||
    !Number.isFinite(input.destination.longitude) ||
    input.destination.latitude < -90 ||
    input.destination.latitude > 90 ||
    input.destination.longitude < -180 ||
    input.destination.longitude > 180
  ) {
    throw new Error('Destino deve possuir coordenadas válidas.');
  }
}

export function matchesRoomSearch(code: string, name: string, term: string) {
  const normalizeSearchText = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  const normalizedTerm = normalizeSearchText(term);
  return (
    Boolean(normalizedTerm) &&
    (normalizeSearchText(code).includes(normalizedTerm) ||
      normalizeSearchText(name).includes(normalizedTerm))
  );
}
