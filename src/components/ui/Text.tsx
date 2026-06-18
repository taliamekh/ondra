import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme';

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
  display: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 27, fontWeight: '800', letterSpacing: -0.4 },
  heading: { fontSize: 21, fontWeight: '700', letterSpacing: -0.2 },
  subtitle: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 21 },
  label: { fontSize: 13, fontWeight: '600' },
  caption: { fontSize: 12, fontWeight: '500' },
  button: { fontSize: 15, fontWeight: '700' },
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
