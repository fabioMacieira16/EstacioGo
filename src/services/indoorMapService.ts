import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  type Firestore,
} from 'firebase/firestore';

import { db } from '../firebase/firestore';
import type { IndoorFloor, IndoorMapDocument } from '../types/indoorMap';

const INDOOR_MAPS_COLLECTION = 'indoorMaps';

type IndoorMapServiceDependencies = { firestore: Firestore };
const defaultDependencies: IndoorMapServiceDependencies = { firestore: db };

export function createIndoorMapService(
  dependencies: IndoorMapServiceDependencies = defaultDependencies,
) {
  const indoorMaps = collection(dependencies.firestore, INDOOR_MAPS_COLLECTION);

  return {
    async listFloorsByBuilding(buildingId: string): Promise<IndoorFloor[]> {
      const snapshot = await getDocs(
        query(
          indoorMaps,
          where('buildingId', '==', buildingId),
          where('active', '==', true),
        ),
      );
      return snapshot.docs
        .map((item) => ({ id: item.id, ...(item.data() as Omit<IndoorMapDocument, 'id'>) }))
        .sort((a, b) => a.number - b.number);
    },

    async listBuildingIds(campusId: string): Promise<string[]> {
      const snapshot = await getDocs(
        query(
          indoorMaps,
          where('campusId', '==', campusId),
          where('active', '==', true),
        ),
      );
      const buildingIds = snapshot.docs.map(
        (item) => (item.data() as IndoorMapDocument).buildingId,
      );
      return Array.from(new Set(buildingIds));
    },

    async saveFloor(floor: IndoorMapDocument): Promise<void> {
      const { id, ...data } = floor;
      await setDoc(doc(dependencies.firestore, INDOOR_MAPS_COLLECTION, id), data);
    },
  };
}

export const indoorMapService = createIndoorMapService();
export type IndoorMapService = ReturnType<typeof createIndoorMapService>;
