import { Redirect, Stack, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider } from '../src/contexts/AuthContext';
import { useAuth } from '../src/hooks/useAuth';

function RouteGuard() {
  const segments = useSegments();
  const { loading, user } = useAuth();
  const isLoginRoute = segments[0] === 'login';
  const isAdminRoute = segments[0] === 'admin';

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user && !isLoginRoute) return <Redirect href="/login" />;
  if (user && isLoginRoute) return <Redirect href="/" />;
  if (user && isAdminRoute && user.role !== 'ADMIN') return <Redirect href="/" />;

  return <Stack />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard />
    </AuthProvider>
  );
}
