import { Ionicons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  icon: IconName;
  onPress?: () => void;
  size?: number;
  variant?: 'ghost' | 'surface' | 'solid';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({ icon, onPress, size = 22, variant = 'ghost', color, style }: Props) {
  const theme = useTheme();
  const c = theme.colors;
  const bg = variant === 'solid' ? c.primary : variant === 'surface' ? c.bgAlt : 'transparent';
  const fg = color ?? (variant === 'solid' ? c.onPrimary : c.text);
  const dim = size + 18;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          borderWidth: variant === 'surface' ? 1 : 0,
          borderColor: c.border,
        },
        pressed && { opacity: 0.65 },
        style,
      ]}>
      <Ionicons name={icon} size={size} color={fg} />
    </Pressable>
  );
}
