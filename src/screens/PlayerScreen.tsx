import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { getPlayableLink } from '../scraper';
import type { PlayableLink } from '../scraper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

export function PlayerScreen({ route, navigation }: Props) {
  const { showId, episodeString, title } = route.params;
  const [link, setLink] = useState<PlayableLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title });
    (async () => {
      try {
        const l = await getPlayableLink(showId, episodeString, 'sub');
        setLink(l);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to resolve source');
      }
    })();
  }, [showId, episodeString, title, navigation]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  if (!link) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.hint}>Resolving source…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        source={{
          uri: link.uri,
          type: link.isHls ? 'm3u8' : 'mp4',
          headers: link.referer ? { Referer: link.referer } : undefined,
        }}
        style={styles.video}
        controls
        resizeMode="contain"
        onError={e => setError(`Playback error: ${JSON.stringify(e)}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: { flex: 1 },
  error: { color: '#f55', padding: 16, textAlign: 'center' },
  hint: { color: '#888', marginTop: 8 },
});
