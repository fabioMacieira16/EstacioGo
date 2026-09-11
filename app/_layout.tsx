import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../src/contexts/AuthContext';
import { navigationTheme } from '../src/constants/navigationTheme';
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
      <StatusBar barStyle="light-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: navigationTheme.sidebarBackground },
        }}
      />
      {loading ? (
        <View style={styles.loadingScreen}>
          <ActivityIndicator color={navigationTheme.accent} size="large" />
        </View>
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RouteGuard />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingScreen: {
    alignItems: 'center',
    backgroundColor: navigationTheme.sidebarBackground,
    flex: 1,
    justifyContent: 'center',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
