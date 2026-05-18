import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getShowDetail, listEpisodes } from '../scraper';
import type { EpisodeInfo, ShowDetail } from '../scraper';
import { isInWatchlist, toggleWatchlist } from '../storage';
import type { RootStackParamList } from '../navigation';
import { Button, GenreChip, Icon } from '../components';
import { colors, radii, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Episodes'>;

export function EpisodesScreen({ route, navigation }: Props) {
  const { showId, title, subCount, posterUrl } = route.params;
  const { width } = useWindowDimensions();
  const [episodes, setEpisodes] = useState<EpisodeInfo[]>([]);
  const [detail, setDetail] = useState<ShowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Episodes are required; show info is best-effort enrichment.
      const [list, info] = await Promise.all([
        listEpisodes(showId, 'sub'),
        getShowDetail(showId).catch(() => null),
      ]);
      setEpisodes(list);
      setDetail(info);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load episodes');
    } finally {
      setLoading(false);
    }
  }, [showId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    isInWatchlist(showId).then(setSaved);
  }, [showId]);

  const onToggleSave = useCallback(async () => {
    const next = await toggleWatchlist({
      showId,
      name: title,
      thumbnail: posterUrl,
      subCount,
    });
    setSaved(next);
  }, [showId, title, posterUrl, subCount]);

  useEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <Pressable onPress={onToggleSave} hitSlop={8} style={styles.saveBtn}>
          <Icon
            name={saved ? 'minus' : 'plus'}
            size={16}
            color={saved ? colors.primary : colors.onSurfaceVariant}
          />
        </Pressable>
      ),
    });
  }, [title, navigation, saved, onToggleSave]);

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

  const bannerUri = detail?.banner ?? detail?.thumbnail ?? posterUrl;
  const genres = detail?.genres ?? [];

  const info = (
    <View>
      <View style={[styles.banner, { height: Math.round(width * 0.52) }]}>
        {bannerUri ? (
          <Image
            source={{ uri: bannerUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : null}
        <LinearGradient
          colors={['transparent', 'rgba(16,19,26,0.5)', colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.bannerTitle} numberOfLines={2}>
          {detail?.name ?? title}
        </Text>
      </View>

      <View style={styles.metaBlock}>
        <View style={styles.metaRow}>
          {detail?.score != null ? (
            <View style={styles.rating}>
              <Icon name="star" size={13} color={colors.primary} />
              <Text style={styles.ratingText}>{detail.score.toFixed(1)}</Text>
            </View>
          ) : null}
          <Text style={styles.epCount}>
            {episodes.length} episode{episodes.length === 1 ? '' : 's'} · SUB
          </Text>
        </View>

        {genres.length > 0 ? (
          <View style={styles.genres}>
            {genres.slice(0, 5).map(g => (
              <GenreChip key={g} label={g} style={styles.chip} />
            ))}
          </View>
        ) : null}

        {detail?.description ? (
          <Text style={styles.desc}>{detail.description}</Text>
        ) : null}
      </View>

      <Text style={styles.episodesHeading}>Episodes</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={episodes}
      numColumns={4}
      keyExtractor={item => item.episodeString}
      ListHeaderComponent={info}
      columnWrapperStyle={styles.episodeRow}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
          onPress={() =>
            navigation.navigate('Player', {
              showId,
              episodeString: item.episodeString,
              title: `${title} — Ep ${item.episodeString}`,
              showName: title,
              posterUrl,
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
  list: { paddingBottom: spacing.stackLg },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.gutter,
  },

  banner: {
    width: '100%',
    backgroundColor: colors.surfaceContainer,
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.base,
  },
  metaBlock: { paddingHorizontal: spacing.gutter },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.stackMd,
  },
  ratingText: {
    ...typography.labelSm,
    letterSpacing: 0,
    color: colors.primary,
    marginLeft: 3,
  },
  epCount: {
    ...typography.labelSm,
    letterSpacing: 0,
    color: colors.onSurfaceVariant,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.stackMd,
  },
  chip: {
    marginRight: spacing.stackSm,
    marginBottom: spacing.stackSm,
  },
  desc: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackMd,
  },
  episodesHeading: {
    ...typography.headlineMd,
    fontSize: 20,
    lineHeight: 26,
    color: colors.onSurface,
    marginLeft: spacing.gutter,
    marginTop: spacing.stackLg,
    marginBottom: spacing.stackMd,
  },

  episodeRow: { paddingHorizontal: spacing.base },
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
  saveBtn: { flexDirection: 'row', alignItems: 'center' },
  saveAction: {
    ...typography.labelSm,
    letterSpacing: 0,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
  saveActionOn: { color: colors.primary },
});
