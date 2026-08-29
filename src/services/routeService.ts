import { doc, getDoc, type Firestore } from 'firebase/firestore';

import { db } from '../firebase/firestore';
import type { Route } from '../types/route';

const ROUTES_COLLECTION = 'routes';
type RouteServiceDependencies = { firestore: Firestore };
const defaultDependencies: RouteServiceDependencies = { firestore: db };

export function createRouteService(
  dependencies: RouteServiceDependencies = defaultDependencies,
) {
  return {
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
