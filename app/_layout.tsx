import { Redirect, Stack, useSegments } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AuthProvider } from '../src/contexts/AuthContext';
import { useAuth } from '../src/hooks/useAuth';

function RouteGuard() {
  const segments = useSegments();
  const { loading, user } = useAuth();
  const isLoginRoute = segments[0] === 'login';
  const isAdminRoute = segments[0] === 'admin';

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color="#0F766E" size="large" />
      </View>
    );
  }

  if (!user && !isLoginRoute) return <Redirect href="/login" />;
  if (user && isLoginRoute) return <Redirect href="/" />;
  if (user && isAdminRoute && user.role !== 'ADMIN') return <Redirect href="/" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    />
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
  loadingScreen: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    flex: 1,
    justifyContent: 'center',
  },
});
