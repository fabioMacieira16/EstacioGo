import type { RouteInput } from '../types/route';
import { isValidCoordinates } from './coordinates';

function hasValidBounds(coordinate: { latitude: number; longitude: number }) {
  return (
    coordinate.latitude >= -90 &&
    coordinate.latitude <= 90 &&
    coordinate.longitude >= -180 &&
    coordinate.longitude <= 180
  );
}

export function validateRouteInput(input: RouteInput): void {
  if (!input.campusId.trim()) throw new Error('Campus é obrigatório.');
  if (!input.name.trim()) throw new Error('Nome da rota é obrigatório.');
  if (!isValidCoordinates(input.origin) || !hasValidBounds(input.origin))
    throw new Error('Origem deve possuir coordenadas válidas.');
  if (
    !isValidCoordinates(input.destination) ||
    !hasValidBounds(input.destination)
  )
    throw new Error('Destino deve possuir coordenadas válidas.');
  if (input.coordinates.length < 2)
    throw new Error('A rota deve possuir ao menos dois pontos.');
  if (
    input.coordinates.some(
      (coordinate) =>
        !isValidCoordinates(coordinate) || !hasValidBounds(coordinate),
    )
  )
    throw new Error('A rota possui coordenadas inválidas.');
}
