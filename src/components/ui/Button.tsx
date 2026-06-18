import { Ionicons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing, useTheme } from '@/theme';

import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';
type IconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  title?: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: boolean;
  loading?: boolean;
  disabled?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SIZES: Record<Size, { h: number; px: number; font: number; icon: number }> = {
  sm: { h: 38, px: 14, font: 13, icon: 16 },
  md: { h: 48, px: 18, font: 15, icon: 18 },
  lg: { h: 56, px: 22, font: 17, icon: 20 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  disabled,
  full,
  style,
}: Props) {
  const theme = useTheme();
  const c = theme.colors;
  const s = SIZES[size];

  const bg =
    variant === 'primary'
      ? c.primary
      : variant === 'danger'
        ? c.danger
        : variant === 'secondary'
          ? c.bgInset
          : 'transparent';

  let fg = c.text;
  if (variant === 'primary') fg = c.onPrimary;
  else if (variant === 'danger') fg = '#FFFFFF';
  else if (variant === 'outline') fg = c.primary;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          height: s.h,
          paddingHorizontal: s.px,
          borderRadius: theme.radius.pill,
          backgroundColor: bg,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? c.primary : 'transparent',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.two,
        },
        full && { alignSelf: 'stretch' },
        isDisabled && { opacity: 0.5 },
        pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && !iconRight ? <Ionicons name={icon} size={s.icon} color={fg} /> : null}
          {title ? (
            <Text variant="button" color={fg} style={{ fontSize: s.font }}>
              {title}
            </Text>
          ) : null}
          {icon && iconRight ? <Ionicons name={icon} size={s.icon} color={fg} /> : null}
        </>
      )}
    </Pressable>
  );
}
