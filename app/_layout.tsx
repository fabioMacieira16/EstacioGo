import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';

import { AuthProvider } from '../src/contexts/AuthContext';
import { useAuth } from '../src/hooks/useAuth';

function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { loading, user } = useAuth();
  const isLoginRoute = segments[0] === 'login';
  const isAdminRoute = segments[0] === 'admin';

  useEffect(() => {
    if (loading) return;

    if (!user && !isLoginRoute) {
      router.replace('/login');
      return;
    }

    if (user && (isLoginRoute || (isAdminRoute && user.role !== 'ADMIN'))) {
      router.replace('/');
    }
  }, [isAdminRoute, isLoginRoute, loading, router, user]);

  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}
      />
      {loading ? (
        <View style={styles.loadingScreen}>
          <ActivityIndicator color="#0F766E" size="large" />
        </View>
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingScreen: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    flex: 1,
    justifyContent: 'center',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
