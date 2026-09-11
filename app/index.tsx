import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useAuth } from '../src/hooks/useAuth';
import { NavigationScreen } from '../src/screens/NavigationScreen';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);

  return (
    <NavigationScreen
      roomId={selectedRoomId}
      onSelectRoom={setSelectedRoomId}
      onBack={selectedRoomId ? () => setSelectedRoomId(undefined) : undefined}
      onOpenAdmin={user?.role === 'ADMIN' ? () => router.push('/admin/rooms') : undefined}
    />
  );
}
