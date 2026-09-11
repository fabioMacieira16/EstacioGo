import { getApp, getApps, initializeApp } from 'firebase/app';

function requiredEnv(value: string | undefined, name: string): string {
  if (!value?.trim()) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

const firebaseConfig = {
  apiKey: requiredEnv(process.env.EXPO_PUBLIC_FIREBASE_API_KEY, 'EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: requiredEnv(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN, 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: requiredEnv(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID, 'EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: requiredEnv(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET, 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requiredEnv(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requiredEnv(process.env.EXPO_PUBLIC_FIREBASE_APP_ID, 'EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: requiredEnv(process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID, 'EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
