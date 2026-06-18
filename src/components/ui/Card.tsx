import { type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing, useTheme } from '@/theme';

import { GlassLayers, MetallicLayers } from './surfaces';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean; // soft drop shadow (flat themes only)
  style?: StyleProp<ViewStyle>;
}

/**
 * A surface/card. Its look depends on the active theme's `surface`:
 *   • undefined/'flat' -> solid color (bgAlt) + soft shadow
 *   • 'metallic'       -> shiny brushed-metal panel (see surfaces.tsx)
 *   • 'glass'          -> shiny see-through glass panel (see surfaces.tsx)
 */
export function Card({ children, onPress, padded = true, elevated = true, style }: Props) {
  const theme = useTheme();
  const isGlass = theme.surface === 'glass';
  const isMetal = theme.surface === 'metallic';
  const textured = isGlass || isMetal;

  const base: StyleProp<ViewStyle> = [
    {
      borderRadius: theme.radius.lg,
      borderWidth: isGlass ? 1.5 : 1,
      borderColor: theme.colors.border,
      // Textured cards paint their own background (the layers), so stay transparent.
      backgroundColor: textured ? 'transparent' : theme.colors.bgAlt,
    },
    textured && { overflow: 'hidden' }, // clip the gradients to the rounded corners
    // Drop shadow only on flat cards (overflow:hidden would clip it on textured ones).
    !textured &&
      elevated && {
        shadowColor: theme.colors.shadow,
        shadowOpacity: 1,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: theme.mode === 'dark' ? 0 : 3,
      },
    padded && { padding: Spacing.three },
    style,
  ];

  const layers = isGlass ? <GlassLayers dark={theme.mode === 'dark'} /> : isMetal ? <MetallicLayers /> : null;
  const inner = (
    <>
      {layers}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.92 }]}>
        {inner}
      </Pressable>
    );
  }
  return <View style={base}>{inner}</View>;
}
