import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radii, spacing, typography } from '../theme';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';

type Props = {
  showName: string;
  episodeLabel: string;
  timeLabel: string;
  posterUrl?: string;
  progress: number; // 0..1
  width?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

// Landscape "Continue Watching" card — key art, play affordance, progress bar.
export function ContinueCard({
  showName,
  episodeLabel,
  timeLabel,
  posterUrl,
  progress,
  width = 260,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [{ width }, pressed && styles.pressed, style]}>
      <View style={[styles.thumb, { height: (width * 9) / 16 }]}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
        )}
        <View style={styles.playWrap}>
          <View style={styles.playCircle}>
            <Icon name="play" size={18} color="#ffffff" />
          </View>
        </View>
        <ProgressBar progress={progress} style={styles.progress} />
      </View>
      <View style={styles.meta}>
        <View style={styles.metaText}>
          <Text style={styles.show} numberOfLines={1}>
            {showName}
          </Text>
          <Text style={styles.episode} numberOfLines={1}>
            {episodeLabel}
          </Text>
        </View>
        <Text style={styles.time}>{timeLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  thumb: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  placeholder: { backgroundColor: colors.surfaceContainerHigh },
  playWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: 'rgba(11,14,20,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.stackSm + 2,
  },
  metaText: {
    flex: 1,
    marginRight: spacing.stackMd,
  },
  show: {
    ...typography.labelSm,
    letterSpacing: 0,
    color: colors.primary,
  },
  episode: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
    marginTop: 2,
  },
  time: {
    ...typography.labelSm,
    letterSpacing: 0,
    color: colors.onSurfaceVariant,
  },
});
