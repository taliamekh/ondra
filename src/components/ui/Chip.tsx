import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, selected, onPress, emoji, size = 'md', style }: Props) {
  const theme = useTheme();
  const c = theme.colors;
  const sm = size === 'sm';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: sm ? 12 : 16,
          height: sm ? 34 : 42,
          borderRadius: theme.radius.pill,
          backgroundColor: selected ? c.primary : c.bgInset,
          borderWidth: 1,
          borderColor: selected ? c.primary : c.border,
        },
        pressed && { opacity: 0.85 },
        style,
      ]}>
      {emoji ? <Text style={{ fontSize: sm ? 14 : 16 }}>{emoji}</Text> : null}
      <Text variant="label" color={selected ? c.onPrimary : c.text} style={{ fontSize: sm ? 13 : 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}
