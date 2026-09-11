import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';

import { db } from '../firebase/firestore';
import type { Building } from '../types/building';

const BUILDINGS_COLLECTION = 'buildings';

type BuildingServiceDependencies = { firestore: Firestore };
const defaultDependencies: BuildingServiceDependencies = { firestore: db };

export function createBuildingService(
  dependencies: BuildingServiceDependencies = defaultDependencies,
) {
  const buildings = collection(dependencies.firestore, BUILDINGS_COLLECTION);

  return {
    async listBuildings(campusId: string): Promise<Building[]> {
      const snapshot = await getDocs(
        query(
          buildings,
          where('campusId', '==', campusId),
          where('active', '==', true),
        ),
      );
      return snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Building, 'id'>),
      }));
    },

    async createBuilding(input: Omit<Building, 'id'>): Promise<string> {
      const created = await addDoc(buildings, input);
      return created.id;
    },
  };
}

export const buildingService = createBuildingService();
export type BuildingService = ReturnType<typeof createBuildingService>;
