import { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from 'react-native-bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getWatchlist, type WatchlistEntry } from '../storage';
import type { TabScreenProps } from '../navigation';
import { AnimeCard, Icon } from '../components';
import { colors, spacing, typography } from '../theme';

type Props = TabScreenProps<'Library'>;

const GRID_GUTTER = spacing.gutter;

export function LibraryScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const cardWidth = (width - GRID_GUTTER * 3) / 2;
  const [items, setItems] = useState<WatchlistEntry[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      getWatchlist().then(setItems);
    }, []),
  );

  if (items && items.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="bookmark" size={48} color={colors.onSurfaceVariant} />
        <Text style={styles.emptyTitle}>Your Library is empty</Text>
        <Text style={styles.hint}>
          Tap "<Icon name="plus" size={16} color={colors.onSurfaceVariant} />" on any anime and it will show up here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={items ?? []}
      keyExtractor={item => item.showId}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      ListHeaderComponent={<Text style={styles.screenTitle}>Library</Text>}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.base,
          paddingBottom: tabBarHeight + spacing.gutter,
        },
      ]}
      renderItem={({ item }) => (
        <AnimeCard
          title={item.name}
          posterUrl={item.thumbnail}
          subtitle={`${item.subCount} EP`}
          width={cardWidth}
          style={styles.gridCard}
          onPress={() =>
            navigation.navigate('Episodes', {
              showId: item.showId,
              title: item.name,
              subCount: item.subCount,
              posterUrl: item.thumbnail,
            })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingVertical: spacing.gutter },
  gridRow: {
    paddingHorizontal: spacing.gutter,
    justifyContent: 'space-between',
  },
  gridCard: { marginBottom: spacing.gutter },
  screenTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginLeft: spacing.gutter,
    marginBottom: spacing.stackMd,
  },
  empty: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.gutter,
  },
  emptyTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: spacing.stackMd,
  },
  hint: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.stackSm,
  },
});
