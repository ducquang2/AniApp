import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getPlayableLinks, type PlayableLink } from '../scraper';
import type { RootStackParamList } from '../navigation';

const USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const SKIP_MS = 5000;

// VLCPlayer doesn't accept request headers directly — pass via libvlc CLI options.
function buildInitOptions(referer: string | undefined): string[] {
  return [
    `--http-referrer=${referer ?? 'https://allmanga.to'}`,
    `--http-user-agent=${USER_AGENT}`,
    '--network-caching=1500',
  ];
}

// VLCKit reports time/length in milliseconds.
function formatMs(ms: number): string {
  if (!isFinite(ms) || ms <= 0) return '00:00';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

export function PlayerScreen({ route, navigation }: Props) {
  const { showId, episodeString, title } = route.params;
  const [links, setLinks] = useState<PlayableLink[]>([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState({ currentMs: 0, durationMs: 0 });
  const [scrubFraction, setScrubFraction] = useState<number | null>(null);
  const isFocused = useIsFocused();
  const playerRef = useRef<any>(null);
  const trackWidthRef = useRef(0);
  const link = links[index] ?? null;

  // VLC seek takes a 0–1 fraction.
  const seekToFraction = (f: number) => {
    playerRef.current?.seek?.(clamp01(f));
  };

  useEffect(() => {
    navigation.setOptions({ title });
    (async () => {
      try {
        const l = await getPlayableLinks(showId, episodeString, 'sub');
        setLinks(l);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to resolve source');
      }
    })();
  }, [showId, episodeString, title, navigation]);

  // Stop the libVLC player explicitly on unmount so audio doesn't outlive the screen.
  useEffect(() => {
    return () => {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        playerRef.current?.stopPlayer?.();
      } catch {}
    };
  }, []);

  const handlePlaybackError = (e: unknown) => {
    if (index + 1 < links.length) {
      console.log('Playback error, trying next provider', e);
      setIndex(index + 1);
      return;
    }
    setError(`Playback error (all providers failed): ${JSON.stringify(e)}`);
  };

  const tryNextSource = () => {
    if (index + 1 < links.length) setIndex(index + 1);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        links.length > 1 ? (
          <Pressable onPress={tryNextSource} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>
              {index + 1 < links.length
                ? `Next source (${index + 1}/${links.length})`
                : `Source ${index + 1}/${links.length}`}
            </Text>
          </Pressable>
        ) : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, links, index]);

  // Drag/tap the seek bar. Reads track width via ref so the closure stays valid.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: e => {
        setScrubFraction(
          clamp01(e.nativeEvent.locationX / (trackWidthRef.current || 1)),
        );
      },
      onPanResponderMove: e => {
        setScrubFraction(
          clamp01(e.nativeEvent.locationX / (trackWidthRef.current || 1)),
        );
      },
      onPanResponderRelease: e => {
        const f = clamp01(
          e.nativeEvent.locationX / (trackWidthRef.current || 1),
        );
        seekToFraction(f);
        setScrubFraction(null);
      },
      onPanResponderTerminate: () => setScrubFraction(null),
    }),
  ).current;

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        {link ? <Text style={styles.hint}>{link.uri}</Text> : null}
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

  const liveFraction =
    progress.durationMs > 0 ? progress.currentMs / progress.durationMs : 0;
  const displayFraction = scrubFraction ?? liveFraction;
  const displayCurrentMs =
    scrubFraction != null
      ? scrubFraction * progress.durationMs
      : progress.currentMs;

  const skip = (deltaMs: number) => {
    if (progress.durationMs <= 0) return;
    seekToFraction((progress.currentMs + deltaMs) / progress.durationMs);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.videoWrap} onPress={() => setPaused(p => !p)}>
        <VLCPlayer
          key={link.uri}
          ref={playerRef}
          source={{
            uri: link.uri,
            initType: 2,
            initOptions: buildInitOptions(link.referer),
          }}
          style={styles.video}
          paused={paused || !isFocused}
          autoplay
          resizeMode="contain"
          onProgress={e =>
            setProgress({
              currentMs: e.currentTime ?? 0,
              durationMs: e.duration ?? 0,
            })
          }
          onError={handlePlaybackError}
        />
      </Pressable>

      <View style={styles.controls}>
        <View
          style={styles.seekArea}
          onLayout={e => {
            trackWidthRef.current = e.nativeEvent.layout.width;
          }}
          {...panResponder.panHandlers}
        >
          <View style={styles.seekLine}>
            <View
              style={[styles.seekFill, { width: `${displayFraction * 100}%` }]}
            />
          </View>
          <View
            style={[styles.seekKnob, { left: `${displayFraction * 100}%` }]}
            pointerEvents="none"
          />
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={() => skip(-SKIP_MS)}
            style={styles.btn}
            hitSlop={8}
          >
            <Text style={styles.btnText}>« 5s</Text>
          </Pressable>
          <Pressable
            onPress={() => setPaused(p => !p)}
            style={styles.btn}
            hitSlop={8}
          >
            <Text style={styles.playText}>{paused ? '▶' : '❚❚'}</Text>
          </Pressable>
          <Pressable
            onPress={() => skip(SKIP_MS)}
            style={styles.btn}
            hitSlop={8}
          >
            <Text style={styles.btnText}>5s »</Text>
          </Pressable>
          <View style={styles.spacer} />
          <Text style={styles.time}>
            {formatMs(displayCurrentMs)} / {formatMs(progress.durationMs)}
          </Text>
        </View>
      </View>
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
  videoWrap: { flex: 1 },
  video: { flex: 1 },
  error: { color: '#f55', padding: 16, textAlign: 'center' },
  hint: { color: '#888', marginTop: 8 },
  headerButton: { paddingHorizontal: 8, paddingVertical: 4 },
  headerButtonText: { color: '#4af', fontSize: 14 },
  controls: { backgroundColor: '#111', paddingHorizontal: 12, paddingBottom: 12 },
  seekArea: { height: 28, justifyContent: 'center' },
  seekLine: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  seekFill: { height: '100%', backgroundColor: '#4af' },
  seekKnob: {
    position: 'absolute',
    width: 14,
    height: 14,
    marginLeft: -7,
    borderRadius: 7,
    backgroundColor: '#4af',
  },
  buttonRow: { flexDirection: 'row', alignItems: 'center' },
  btn: { paddingHorizontal: 10, paddingVertical: 6 },
  btnText: { color: '#fff', fontSize: 14 },
  playText: { color: '#fff', fontSize: 16 },
  spacer: { flex: 1 },
  time: {
    color: '#ccc',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
});
