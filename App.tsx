import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from './src/navigation';
import { SearchScreen } from './src/screens/SearchScreen';
import { EpisodesScreen } from './src/screens/EpisodesScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { colors, typography } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surfaceContainerLowest },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    color: colors.onSurface,
    fontFamily: typography.headlineMd.fontFamily,
    fontWeight: typography.headlineMd.fontWeight,
  },
  contentStyle: { backgroundColor: colors.background },
} as const;

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
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
