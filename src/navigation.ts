import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Episodes: {
    showId: string;
    title: string;
    subCount: number;
    posterUrl?: string;
  };
  Player: {
    showId: string;
    episodeString: string;
    title: string;
    showName: string;
    posterUrl?: string;
    resumeFraction?: number;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Tab screens also need to reach Episodes/Player on the parent stack.
export type TabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    NativeBottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
