import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { listEpisodes, type EpisodeInfo } from '../scraper';
import type { RootStackParamList } from '../navigation';
import { Button } from '../components';
import { colors, radii, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Episodes'>;

export function EpisodesScreen({ route, navigation }: Props) {
  const { showId, title } = route.params;
  const [episodes, setEpisodes] = useState<EpisodeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listEpisodes(showId, 'sub');
      setEpisodes(list);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load episodes');
    } finally {
      setLoading(false);
    }
  }, [showId]);

  useEffect(() => {
    navigation.setOptions({ title });
    load();
  }, [title, navigation, load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primaryContainer} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={load} style={styles.retry} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={episodes}
      numColumns={4}
      keyExtractor={item => item.episodeString}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
          onPress={() =>
            navigation.navigate('Player', {
              showId,
              episodeString: item.episodeString,
              title: `${title} — Ep ${item.episodeString}`,
            })
          }>
          <Text style={styles.cellText}>{item.episodeString}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.base },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.gutter,
  },
  cell: {
    flex: 1,
    margin: spacing.stackSm + 2,
    paddingVertical: 18,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.base,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
  },
  cellPressed: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.primaryContainer,
  },
  cellText: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  error: {
    color: colors.error,
    ...typography.bodyMd,
    textAlign: 'center',
  },
  retry: { marginTop: spacing.stackMd },
});
