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
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {
  getLatestUpdates,
  getPopular,
  getShowDetail,
  type SearchResult,
  type ShowDetail,
} from '../scraper';
import {
  getHistory,
  isInWatchlist,
  toggleWatchlist,
  type HistoryEntry,
} from '../storage';
import type { TabScreenProps } from '../navigation';
import { AnimeCard, Button, ContinueCard, GenreChip, Icon } from '../components';
import { colors, radii, spacing, typography } from '../theme';

type Props = TabScreenProps<'Home'>;

const GRID_GUTTER = spacing.gutter;

function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function HomeScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [hero, setHero] = useState<ShowDetail | null>(null);
  const [heroBase, setHeroBase] = useState<SearchResult | null>(null);
  const [heroSaved, setHeroSaved] = useState(false);
  const [trending, setTrending] = useState<SearchResult[]>([]);
  const [recent, setRecent] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardWidth = (width - GRID_GUTTER * 3) / 2;
  const heroHeight = Math.max(440, Math.round(height * 0.6));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [popular, latest] = await Promise.all([
        getPopular(),
        getLatestUpdates(),
      ]);
      setRecent(latest);
      const featured = popular[0] ?? null;
      setHeroBase(featured);
      setTrending(popular.slice(1));
      if (featured) {
        const [detail, saved] = await Promise.all([
          getShowDetail(featured.id),
          isInWatchlist(featured.id),
        ]);
        setHero(detail);
        setHeroSaved(saved);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Watch history is local — refresh it every time Home regains focus.
  useFocusEffect(
    useCallback(() => {
      getHistory().then(setHistory);
    }, []),
  );

  const openShow = (item: SearchResult) =>
    navigation.navigate('Episodes', {
      showId: item.id,
      title: item.name,
      subCount: item.availableEpisodes.sub,
      posterUrl: item.thumbnail,
    });

  const resumeEpisode = (h: HistoryEntry) =>
    navigation.navigate('Player', {
      showId: h.showId,
      episodeString: h.episodeString,
      title: `${h.name} — Ep ${h.episodeString}`,
      showName: h.name,
      posterUrl: h.thumbnail,
      resumeFraction: h.positionMs / h.durationMs,
    });

  const toggleHeroSaved = async () => {
    if (!heroBase) return;
    const saved = await toggleWatchlist({
      showId: heroBase.id,
      name: heroBase.name,
      thumbnail: heroBase.thumbnail,
      subCount: heroBase.availableEpisodes.sub,
    });
    setHeroSaved(saved);
  };

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

  const header = (
    <View>
      {hero && heroBase ? (
        <View style={[styles.hero, { height: heroHeight }]}>
          {hero.banner || hero.thumbnail ? (
            <Image
              source={{ uri: hero.banner ?? hero.thumbnail }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : null}
          <LinearGradient
            colors={['rgba(16,19,26,0.65)', 'transparent']}
            style={styles.heroTopFade}
          />
          <LinearGradient
            colors={['transparent', 'rgba(16,19,26,0.6)', colors.background]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[styles.wordmark, { top: insets.top + spacing.base }]}>
            AniApp
          </Text>
          <View style={styles.heroContent}>
            <View style={styles.heroMetaRow}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>TRENDING #1</Text>
              </View>
              {hero.score != null ? (
                <View style={styles.heroRating}>
                  <Icon name="star" size={13} color={colors.primary} />
                  <Text style={styles.heroRatingText}>
                    {hero.score.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {hero.name}
            </Text>
            {hero.description ? (
              <Text style={styles.heroDesc} numberOfLines={2}>
                {hero.description}
              </Text>
            ) : null}
            {hero.genres.length > 0 ? (
              <View style={styles.heroGenres}>
                {hero.genres.slice(0, 3).map(g => (
                  <GenreChip key={g} label={g} style={styles.heroChip} />
                ))}
              </View>
            ) : null}
            <View style={styles.heroActions}>
              <Button
                title="WATCH NOW"
                icon="play"
                iconSize={20}
                onPress={() => openShow(heroBase)}
                style={styles.watchBtn}
              />
              <Pressable
                onPress={toggleHeroSaved}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.saveBtn,
                  pressed && styles.pressed,
                ]}>
                <Icon
                  name={heroSaved ? 'minus' : 'plus'}
                  size={20}
                  color={colors.onSurface}
                />
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}

      {history.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          <FlatList
            horizontal
            data={history}
            keyExtractor={h => h.showId}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
            renderItem={({ item }) => (
              <ContinueCard
                showName={item.name}
                episodeLabel={`Episode ${item.episodeString}`}
                timeLabel={`${formatClock(item.positionMs)} / ${formatClock(
                  item.durationMs,
                )}`}
                posterUrl={item.thumbnail}
                progress={item.positionMs / item.durationMs}
                onPress={() => resumeEpisode(item)}
                width={260}
                style={styles.continueCard}
              />
            )}
          />
        </View>
      ) : null}

      {recent.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Updated</Text>
          <FlatList
            horizontal
            data={recent}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
            renderItem={({ item }) => (
              <AnimeCard
                title={item.name}
                posterUrl={item.thumbnail}
                subtitle={`${item.availableEpisodes.sub} EP`}
                width={130}
                style={styles.recentCard}
                onPress={() => openShow(item)}
              />
            )}
          />
        </View>
      ) : null}

      {trending.length > 0 ? (
        <Text style={[styles.sectionTitle, styles.gridTitle]}>
          Trending Now
        </Text>
      ) : null}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={trending}
      keyExtractor={item => item.id}
      numColumns={2}
      ListHeaderComponent={header}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <AnimeCard
          title={item.name}
          posterUrl={item.thumbnail}
          subtitle={`${item.availableEpisodes.sub} EP`}
          width={cardWidth}
          style={styles.gridCard}
          onPress={() => openShow(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.stackLg },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.gutter,
  },
  error: { color: colors.error, ...typography.bodyMd, textAlign: 'center' },
  retry: { marginTop: spacing.stackMd },

  hero: { width: '100%', justifyContent: 'flex-end' },
  heroTopFade: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  wordmark: {
    position: 'absolute',
    left: spacing.gutter,
    ...typography.headlineMd,
    fontSize: 20,
    color: colors.onSurface,
  },
  heroContent: { padding: spacing.gutter },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center' },
  heroBadge: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.full,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: 3,
  },
  heroBadgeText: { ...typography.labelSm, color: '#ffffff' },
  heroRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.stackMd,
  },
  heroRatingText: {
    ...typography.labelSm,
    letterSpacing: 0,
    color: colors.primary,
    marginLeft: 3,
  },
  heroTitle: {
    ...typography.displayLgMobile,
    color: colors.onSurface,
    marginTop: spacing.base,
  },
  heroDesc: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
  },
  heroGenres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.stackMd,
  },
  heroChip: {
    marginRight: spacing.stackSm,
    marginBottom: spacing.stackSm,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.gutter,
  },
  watchBtn: { marginRight: spacing.stackMd },
  saveBtn: {
    width: 52,
    height: 44,
    borderRadius: radii.base,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },

  section: { marginTop: spacing.stackLg },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 20,
    lineHeight: 26,
    color: colors.onSurface,
    marginLeft: spacing.gutter,
    marginBottom: spacing.stackMd,
  },
  gridTitle: { marginTop: spacing.stackLg },
  row: { paddingHorizontal: spacing.gutter },
  continueCard: { marginRight: spacing.stackMd },
  recentCard: { marginRight: spacing.stackMd },
  gridRow: {
    paddingHorizontal: spacing.gutter,
    justifyContent: 'space-between',
  },
  gridCard: { marginBottom: spacing.gutter },
});
