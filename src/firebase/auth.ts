import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { Platform } from 'react-native';

import { firebaseApp } from './config';

export const auth =
	Platform.OS === 'web'
		? getAuth(firebaseApp)
		: initializeAuth(firebaseApp, {
				persistence: getReactNativePersistence(AsyncStorage),
			});
