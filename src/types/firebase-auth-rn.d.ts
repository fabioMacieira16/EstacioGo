declare module '@firebase/auth/dist/rn/index.js' {
  export function getReactNativePersistence(storage: {
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
    setItem: (key: string, value: string) => Promise<void>;
  }): unknown;
}
