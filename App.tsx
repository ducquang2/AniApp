import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { RootStackParamList } from './src/navigation';
import { SearchScreen } from './src/screens/SearchScreen';
import { EpisodesScreen } from './src/screens/EpisodesScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: '#0e0e10' },
  headerTintColor: '#fff',
  contentStyle: { backgroundColor: '#0e0e10' },
} as const;

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0e0e10" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: 'AniApp' }}
          />
          <Stack.Screen name="Episodes" component={EpisodesScreen} />
          <Stack.Screen name="Player" component={PlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
