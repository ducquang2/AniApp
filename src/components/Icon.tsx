import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { colors } from '../theme';

// IcoMoon icon font — built from src/assets/icons/untitled-project, bundled
// as Untitled.ttf and linked alongside the text fonts.
const ICON_FONT = 'Untitled';

// Codepoints assigned by the IcoMoon build (see font/demo.html).
const GLYPHS = {
  home: 0xf008,
  search: 0xf003,
  bookmark: 0xf00a,
  play: 0xf005,
  pause: 0xf006,
  backward: 0xf00b,
  forward: 0xf009,
  star: 0xf002,
  plus: 0xf004,
  minus: 0xf007,
} as const;

export type IconName = keyof typeof GLYPHS;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

// Renders one IcoMoon glyph. `color`/`size` map straight onto the text.
export function Icon({
  name,
  size = 24,
  color = colors.onSurface,
  style,
}: Props) {
  return (
    <Text
      allowFontScaling={false}
      style={[styles.icon, { fontSize: size, color }, style]}>
      {String.fromCodePoint(GLYPHS[name])}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontFamily: ICON_FONT,
    includeFontPadding: false,
  },
});
