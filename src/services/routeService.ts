import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';

import { db } from '../firebase/firestore';
import type { Route, RouteInput } from '../types/route';
import { validateRouteInput } from '../utils/route';

const ROUTES_COLLECTION = 'routes';
type RouteServiceDependencies = { firestore: Firestore };
const defaultDependencies: RouteServiceDependencies = { firestore: db };

export function createRouteService(
  dependencies: RouteServiceDependencies = defaultDependencies,
) {
  return {
    async createRoute(input: RouteInput): Promise<string> {
      validateRouteInput(input);
      const created = await addDoc(
        collection(dependencies.firestore, ROUTES_COLLECTION),
        {
          ...input,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      );
      return created.id;
    },

    async getRouteById(routeId: string): Promise<Route | null> {
      const snapshot = await getDoc(
        doc(dependencies.firestore, ROUTES_COLLECTION, routeId),
      );
      if (!snapshot.exists() || snapshot.data().active !== true) return null;
      return { id: snapshot.id, ...(snapshot.data() as Omit<Route, 'id'>) };
    },
  };
}

export const routeService = createRouteService();
export type RouteService = ReturnType<typeof createRouteService>;
