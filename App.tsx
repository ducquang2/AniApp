import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { MainTabParamList, RootStackParamList } from './src/navigation';
import { HomeScreen } from './src/screens/HomeScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { EpisodesScreen } from './src/screens/EpisodesScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { colors, typography } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createNativeBottomTabNavigator<MainTabParamList>();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surfaceContainerLowest },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    color: colors.onSurface,
    fontFamily: typography.headlineMd.fontFamily,
  },
  contentStyle: { backgroundColor: colors.background },
} as const;

// Native UITabBarController — on iOS 26 it picks up Liquid Glass and the
// scroll-driven minimize animation automatically. Icons are SF Symbols.
function MainTabs() {
  return (
    <Tab.Navigator
      minimizeBehavior="onScrollDown"
      translucent
      tabBarActiveTintColor={colors.primary}
      tabBarInactiveTintColor={colors.onSurfaceVariant}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'house.fill' : 'house',
          }),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: () => ({ sfSymbol: 'magnifyingglass' }),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          title: 'Library',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'bookmark.fill' : 'bookmark',
          }),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={stackScreenOptions}>
          <Stack.Screen
            name="Tabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Episodes" component={EpisodesScreen} />
          <Stack.Screen name="Player" component={PlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
