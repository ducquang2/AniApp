import { useEffect, useState } from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Episodes'>;

export function EpisodesScreen({ route, navigation }: Props) {
  const { showId, title } = route.params;
  const [episodes, setEpisodes] = useState<EpisodeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title });
    (async () => {
      try {
        const list = await listEpisodes(showId, 'sub');
        setEpisodes(list);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load episodes');
      } finally {
        setLoading(false);
      }
    })();
  }, [showId, title, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={episodes}
      numColumns={4}
      keyExtractor={item => item.episodeString}
      renderItem={({ item }) => (
        <Pressable
          style={styles.cell}
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
  container: { flex: 1, backgroundColor: '#0e0e10' },
  center: {
    flex: 1,
    backgroundColor: '#0e0e10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    flex: 1,
    margin: 6,
    paddingVertical: 18,
    backgroundColor: '#1c1c20',
    borderRadius: 8,
    alignItems: 'center',
  },
  cellText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#f55', textAlign: 'center', padding: 16 },
});
