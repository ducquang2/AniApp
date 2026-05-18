import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radii, spacing, typography } from '../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  icon?: IconName;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
};

// Primary action button — solid Electric Orange, bold text, orange glow.
export function Button({ title, onPress, disabled, icon, iconSize = 18, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? (
        <Icon name={icon} size={iconSize} color="#ffffff" style={styles.icon} />
      ) : null}
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.base,
    paddingVertical: spacing.stackMd,
    paddingHorizontal: spacing.stackLg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.4 },
  icon: { marginRight: spacing.stackSm },
  label: {
    ...typography.headlineMd,
    fontSize: 16,
    lineHeight: 20,
    color: '#ffffff',
  },
});
