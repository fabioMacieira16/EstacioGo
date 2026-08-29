import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type Firestore,
} from 'firebase/firestore';

import { db } from '../firebase/firestore';
import type { Room, RoomInput } from '../types/room';
import {
  matchesRoomSearch,
  normalizeRoomCode,
  validateRoomInput,
} from '../utils/roomCode';

const ROOMS_COLLECTION = 'rooms';

type RoomServiceDependencies = { firestore: Firestore };
const defaultDependencies: RoomServiceDependencies = { firestore: db };

export function createRoomService(
  dependencies: RoomServiceDependencies = defaultDependencies,
) {
  const rooms = collection(dependencies.firestore, ROOMS_COLLECTION);

  return {
    async listRooms(includeInactive = false): Promise<Room[]> {
      const snapshot = await getDocs(
        includeInactive ? rooms : query(rooms, where('active', '==', true)),
      );
      return snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as RoomInput),
      }));
    },

    async searchRooms(term: string): Promise<Room[]> {
      const allRooms = await this.listRooms();
      return allRooms.filter((room) =>
        matchesRoomSearch(room.code, room.name, term),
      );
    },

    async getRoomById(roomId: string): Promise<Room | null> {
      const snapshot = await getDocs(
        query(
          rooms,
          where('__name__', '==', roomId),
          where('active', '==', true),
        ),
      );
      const item = snapshot.docs[0];
      return item ? { id: item.id, ...(item.data() as RoomInput) } : null;
    },

    async createRoom(input: RoomInput): Promise<string> {
      validateRoomInput(input);
      const created = await addDoc(rooms, {
        ...input,
        code: normalizeRoomCode(input.code),
      });
      return created.id;
    },

    async updateRoom(roomId: string, input: RoomInput): Promise<void> {
      validateRoomInput(input);
      await updateDoc(doc(dependencies.firestore, ROOMS_COLLECTION, roomId), {
        ...input,
        code: normalizeRoomCode(input.code),
      });
    },

    async deactivateRoom(roomId: string): Promise<void> {
      await updateDoc(doc(dependencies.firestore, ROOMS_COLLECTION, roomId), {
        active: false,
      });
    },

    async deleteRoom(roomId: string): Promise<void> {
      await deleteDoc(doc(dependencies.firestore, ROOMS_COLLECTION, roomId));
    },
  };
}

export const roomService = createRoomService();
export type RoomService = ReturnType<typeof createRoomService>;
