import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import { colors, glass, radii, spacing, typography } from '../theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

// Glass chip for genres — translucent blur when idle, solid Orange when selected.
export function GenreChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={styles.wrap}
    >
      {selected ? (
        <View style={[styles.chip, styles.chipSelected]}>
          <Text style={[styles.label, styles.labelSelected]}>
            {label.toUpperCase()}
          </Text>
        </View>
      ) : (
        <View style={[styles.chip, styles.chipGlass]}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor={colors.surfaceContainer}
          />
          <Text style={styles.label}>{label.toUpperCase()}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  chip: {
    borderRadius: radii.base,
    paddingVertical: spacing.stackSm + 2,
    paddingHorizontal: spacing.stackMd,
    overflow: 'hidden',
  },
  chipGlass: {
    backgroundColor: glass.level2Fill,
    borderWidth: 1,
    borderColor: glass.level2Border,
  },
  chipSelected: {
    backgroundColor: colors.primaryContainer,
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurface,
  },
  labelSelected: {
    color: colors.surfaceContainerLowest,
  },
});
