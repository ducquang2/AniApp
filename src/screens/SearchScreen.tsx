import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { searchAnime } from '../scraper';
import type { SearchResult } from '../scraper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search anime…"
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {loading && <ActivityIndicator style={styles.loader} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              navigation.navigate('Episodes', {
                showId: item.id,
                title: item.name,
                subCount: item.availableEpisodes.sub,
              })
            }>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.availableEpisodes.sub} sub
              {item.availableEpisodes.dub > 0
                ? ` · ${item.availableEpisodes.dub} dub`
                : ''}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e10' },
  input: {
    margin: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1c1c20',
    color: '#fff',
    fontSize: 16,
  },
  loader: { marginVertical: 12 },
  error: { color: '#f55', marginHorizontal: 16, marginBottom: 8 },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#222',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  meta: { color: '#888', fontSize: 13, marginTop: 4 },
});
