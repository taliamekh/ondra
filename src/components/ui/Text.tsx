import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { Font, useTheme } from '@/theme';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subtitle'
  | 'body'
  | 'label'
  | 'caption'
  | 'button';

const VARIANTS: Record<TextVariant, TextStyle> = {
  display: { fontFamily: Font.extrabold, fontSize: 34, letterSpacing: -0.8 },
  title: { fontFamily: Font.extrabold, fontSize: 26, letterSpacing: -0.6 },
  heading: { fontFamily: Font.bold, fontSize: 20, letterSpacing: -0.4 },
  subtitle: { fontFamily: Font.semibold, fontSize: 16.5, letterSpacing: -0.2 },
  body: { fontFamily: Font.regular, fontSize: 15, lineHeight: 21 },
  label: { fontFamily: Font.semibold, fontSize: 13 },
  caption: { fontFamily: Font.medium, fontSize: 12 },
  button: { fontFamily: Font.bold, fontSize: 15 },
};

interface Props extends TextProps {
  variant?: TextVariant;
  color?: string;
  muted?: boolean;
  center?: boolean;
}

export function Text({ variant = 'body', color, muted, center, style, ...rest }: Props) {
  const theme = useTheme();
  return (
    <RNText
      style={[
        VARIANTS[variant],
        { color: color ?? (muted ? theme.colors.textMuted : theme.colors.text) },
        center && { textAlign: 'center' },
        style,
      ]}
      {...rest}
    />
  );
}
