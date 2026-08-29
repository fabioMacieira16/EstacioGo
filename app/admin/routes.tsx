import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { RouteEditor } from '../../src/components/RouteEditor';
import { routeService } from '../../src/services/routeService';

export default function AdminRoutesScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Editor de rotas</Text>
      <RouteEditor
        onSave={async (route) => {
          await routeService.createRoute(route);
          router.back();
        }}
      />
    </View>
  );
}
