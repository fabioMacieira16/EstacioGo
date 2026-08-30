import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

import type { Coordinates } from '../types/coordinates';

export function useUserLocation() {
  const [location, setLocation] = useState<Coordinates | undefined>();

  useEffect(() => {
    let mounted = true;
    void Location.requestForegroundPermissionsAsync()
      .then(async ({ status }) => {
        if (status !== Location.PermissionStatus.GRANTED) return;
        const result = await Location.getCurrentPositionAsync({});
        if (mounted) {
          setLocation({
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
          });
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  return location;
}
