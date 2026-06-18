import { type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Leading icon, rendered with the resolved foreground color. */
  leading?: (color: string) => ReactNode;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, selected, onPress, leading, size = 'md', style }: Props) {
  const theme = useTheme();
  const c = theme.colors;
  const sm = size === 'sm';
  const fg = selected ? c.onPrimary : c.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: sm ? 13 : 16,
          height: sm ? 34 : 42,
          borderRadius: theme.radius.pill,
          backgroundColor: selected ? c.primary : c.bgInset,
          borderWidth: 1,
          borderColor: selected ? c.primary : c.border,
        },
        pressed && { opacity: 0.85 },
        style,
      ]}>
      {leading ? <View>{leading(fg)}</View> : null}
      <Text variant="label" color={fg} style={{ fontSize: sm ? 13 : 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}
