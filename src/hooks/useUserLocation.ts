import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

import type { Coordinates } from '../types/coordinates';

export type UserLocationStatus =
  | 'loading'
  | 'available'
  | 'permission-denied'
  | 'unavailable';

export type UserLocationState = {
  location?: Coordinates;
  accuracy?: number;
  status: UserLocationStatus;
};

export function useUserLocation() {
  const [state, setState] = useState<UserLocationState>({ status: 'loading' });

  useEffect(() => {
    let mounted = true;
    let subscription: Location.LocationSubscription | undefined;

    const updateLocation = (result: Location.LocationObject) => {
      if (!mounted) return;
      setState({
        status: 'available',
        accuracy: result.coords.accuracy ?? undefined,
        location: {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        },
      });
    };

    void Location.requestForegroundPermissionsAsync()
      .then(async ({ status }) => {
        if (status !== Location.PermissionStatus.GRANTED) {
          if (mounted) setState({ status: 'permission-denied' });
          return;
        }

        const result = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        updateLocation(result);
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5,
            timeInterval: 5000,
          },
          updateLocation,
        );
        if (!mounted) subscription.remove();
      })
      .catch(() => {
        if (mounted) setState({ status: 'unavailable' });
      });

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  return state;
}
