import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from 'react-native-bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { searchAnime, type SearchResult } from '../scraper';
import type { TabScreenProps } from '../navigation';
import { AnimeCard, Button } from '../components';
import { colors, radii, spacing, typography } from '../theme';

type Props = TabScreenProps<'Search'>;

function episodeLabel(item: SearchResult): string {
  const { sub, dub } = item.availableEpisodes;
  const parts = [`${sub} EP`];
  if (dub > 0) parts.push('DUB');
  return parts.join(' · ');
}

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [focused, setFocused] = useState(false);

  const { width } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const cardWidth = (width - spacing.gutter * 3) / 2;

  const onSubmit = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const r = await searchAnime(q, 'sub');
      setResults(r);
    } catch (e: any) {
      setError(e?.message ?? 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        placeholder="Search anime…"
        placeholderTextColor={colors.onSurfaceVariant}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          color={colors.primaryContainer}
        />
      ) : null}

      {error ? (
        <View style={styles.stateBox}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Retry" onPress={onSubmit} style={styles.retry} />
        </View>
      ) : null}

      {!loading && !error && searched && results.length === 0 ? (
        <Text style={styles.hint}>No results found.</Text>
      ) : null}

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: tabBarHeight + spacing.gutter },
        ]}
        renderItem={({ item }) => (
          <AnimeCard
            title={item.name}
            posterUrl={item.thumbnail}
            subtitle={episodeLabel(item)}
            width={cardWidth}
            style={styles.card}
            onPress={() =>
              navigation.navigate('Episodes', {
                showId: item.id,
                title: item.name,
                subCount: item.availableEpisodes.sub,
                posterUrl: item.thumbnail,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  input: {
    margin: spacing.gutter,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: spacing.stackMd,
    borderRadius: radii.base,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    color: colors.onSurface,
    ...typography.bodyMd,
  },
  inputFocused: { borderColor: colors.primaryContainer },
  loader: { marginVertical: spacing.stackMd },
  stateBox: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.stackMd,
  },
  error: { color: colors.error, ...typography.bodyMd },
  retry: { marginTop: spacing.stackMd, alignSelf: 'flex-start' },
  hint: {
    color: colors.onSurfaceVariant,
    ...typography.bodyMd,
    textAlign: 'center',
    marginTop: spacing.stackLg,
  },
  list: { paddingHorizontal: spacing.gutter, paddingBottom: spacing.gutter },
  column: { justifyContent: 'space-between' },
  card: { marginBottom: spacing.gutter },
});
