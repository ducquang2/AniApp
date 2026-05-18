import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors, radii, spacing, typography } from '../theme';

type Props = {
  title: string;
  posterUrl?: string;
  subtitle?: string;
  isNew?: boolean;
  width?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

// 2:3 poster card — bottom gradient overlay houses the title, with a "NEW" badge.
export function AnimeCard({
  title,
  posterUrl,
  subtitle,
  isNew,
  width = 150,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        { width, height: width * 1.5 },
        pressed && styles.pressed,
        style,
      ]}
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
      )}

      <LinearGradient
        colors={['transparent', 'rgba(11,14,20,0.95)']}
        style={styles.overlay}
      />

      {isNew ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NEW</Text>
        </View>
      ) : null}

      <View style={styles.caption}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  pressed: { opacity: 0.85 },
  placeholder: { backgroundColor: colors.surfaceContainerHigh },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  badge: {
    position: 'absolute',
    top: spacing.stackMd,
    left: spacing.stackMd,
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.stackSm + 2,
    paddingVertical: 2,
  },
  badgeText: {
    ...typography.labelSm,
    color: '#ffffff',
  },
  caption: {
    position: 'absolute',
    left: spacing.stackMd,
    right: spacing.stackMd,
    bottom: spacing.stackMd,
  },
  title: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.labelSm,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
