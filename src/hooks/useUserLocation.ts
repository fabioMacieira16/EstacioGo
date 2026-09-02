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
          accuracy: Location.Accuracy.Balanced,
        });
        updateLocation(result);
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
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
