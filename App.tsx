import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { MainTabParamList, RootStackParamList } from './src/navigation';
import { HomeScreen } from './src/screens/HomeScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { EpisodesScreen } from './src/screens/EpisodesScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { Icon, type IconName } from './src/components';
import { colors, typography } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const headerTitleStyle = {
  color: colors.onSurface,
  fontFamily: typography.headlineMd.fontFamily,
};

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surfaceContainerLowest },
  headerTintColor: colors.primary,
  headerTitleStyle,
  contentStyle: { backgroundColor: colors.background },
} as const;

const TAB_ICON: Record<keyof MainTabParamList, IconName> = {
  Home: 'home',
  Search: 'search',
  Library: 'bookmark',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surfaceContainerLowest },
        headerTitleStyle,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopColor: colors.outlineVariant,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarIcon: ({ color, size }) => (
          <Icon name={TAB_ICON[route.name]} color={color} size={size} />
        ),
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
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
