import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing, useTheme } from '@/theme';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean; // adds a drop shadow (ignored on textured themes)
  style?: StyleProp<ViewStyle>;
}

/**
 * A surface/card. How it looks depends on the active theme's `surface`:
 *   • 'flat' (most themes)  -> solid color (bgAlt) with a soft drop shadow
 *   • 'metallic'            -> a brushed-metal sheen gradient behind the content
 *   • 'glass'               -> a frosted, see-through blur behind the content
 *
 * To change card padding/roundness globally, edit Spacing.three / theme.radius.lg.
 */
export function Card({ children, onPress, padded = true, elevated = true, style }: Props) {
  const theme = useTheme();
  const isGlass = theme.surface === 'glass';
  const isMetal = theme.surface === 'metallic' && !!theme.surfaceGradient;
  const textured = isGlass || isMetal;

  const base: StyleProp<ViewStyle> = [
    {
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      // Textured cards paint their own background layer (below), so go transparent.
      backgroundColor: textured ? 'transparent' : theme.colors.bgAlt,
    },
    textured && { overflow: 'hidden' }, // clip the gradient/blur to the rounded corners
    // Shadow only on flat cards — overflow:hidden on textured ones would clip it.
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

  // The background "texture" layer that sits behind the content.
  const textureLayer = isGlass ? (
    <>
      <BlurView
        intensity={45}
        tint={theme.mode === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.mode === 'dark' ? 'rgba(18,18,28,0.35)' : 'rgba(255,255,255,0.4)' },
        ]}
      />
    </>
  ) : isMetal ? (
    <LinearGradient
      colors={theme.surfaceGradient as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  ) : null;

  const inner = (
    <>
      {textureLayer}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.9 }]}>
        {inner}
      </Pressable>
    );
  }
  return <View style={base}>{inner}</View>;
}
