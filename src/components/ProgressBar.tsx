import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors, radii } from '../theme';

type Props = {
  progress: number; // 0..1
  style?: StyleProp<ViewStyle>;
};

// Thin 4px watch-progress bar — Indigo → Orange gradient fill.
export function ProgressBar({ progress, style }: Props) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View style={[styles.track, style]}>
      <LinearGradient
        colors={[colors.secondaryContainer, colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fill, { width: `${pct}%` }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
  },
});
