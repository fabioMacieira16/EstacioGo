import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAuth } from '../../src/hooks/useAuth';
import { NavigationScreen } from '../../src/screens/NavigationScreen';

export default function RouteScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  return (
    <NavigationScreen
      roomId={roomId}
      onSelectRoom={(nextRoomId) => router.replace(`/route/${nextRoomId}`)}
      onBack={() => router.back()}
      onOpenAdmin={user?.role === 'ADMIN' ? () => router.push('/admin/rooms') : undefined}
    />
  );
}
