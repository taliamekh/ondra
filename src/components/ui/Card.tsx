import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing, useTheme } from '@/theme';

/**
 * The texture layers that make a card look like polished metal or glass.
 * They sit BEHIND the card's content (absolute fill, no touches) and are built
 * by stacking gradients:
 *   • a base material gradient,
 *   • a bright diagonal "gloss" streak (this is what makes it look shiny/wet),
 *   • thin bevel lines top (light) + bottom (dark) for a 3D edge.
 * To make metal shinier or glass clearer, tweak the rgba alpha numbers below.
 */

// --- METAL: brushed-aluminium base + a strong diagonal glint -----------------
function MetallicLayers() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* base steel, banded so it looks like a curved reflective surface */}
      <LinearGradient
        colors={['#F4F6F9', '#D3D9E0', '#B9C0C9', '#CDD4DB', '#ECEFF2']}
        locations={[0, 0.28, 0.5, 0.72, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* the shiny glint — a bright white diagonal sweep */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0)',
          'rgba(255,255,255,0)',
          'rgba(255,255,255,0.85)',
          'rgba(255,255,255,0.2)',
          'rgba(255,255,255,0)',
        ]}
        locations={[0, 0.34, 0.47, 0.56, 0.82]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.75 }}
        style={StyleSheet.absoluteFill}
      />
      {/* polished bevel: bright top edge, dark bottom edge */}
      <View style={[StyleSheet.absoluteFill, { borderTopWidth: 1.5, borderTopColor: 'rgba(255,255,255,0.9)' }]} />
      <View style={[StyleSheet.absoluteFill, { borderBottomWidth: 1.5, borderBottomColor: 'rgba(40,50,60,0.18)' }]} />
    </View>
  );
}

// --- GLASS: blurred + see-through + a glossy sheen ---------------------------
function GlassLayers({ dark }: { dark: boolean }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* frost the colorful background showing through */}
      <BlurView intensity={70} tint={dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      {/* faint tint, brighter at the top (light falls from above) — kept low so
          the color behind still shows through like real glass */}
      <LinearGradient
        colors={
          dark
            ? ['rgba(45,45,65,0.34)', 'rgba(20,20,35,0.12)']
            : ['rgba(255,255,255,0.36)', 'rgba(255,255,255,0.08)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* glossy reflection sweep across the top */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
        locations={[0, 0.32, 0.46, 0.66]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.85 }}
        style={StyleSheet.absoluteFill}
      />
      {/* bright glass edge catching the light along the top */}
      <View style={[StyleSheet.absoluteFill, { borderTopWidth: 1.5, borderTopColor: 'rgba(255,255,255,0.85)' }]} />
    </View>
  );
}

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
 *   • 'metallic'       -> shiny brushed-metal panel
 *   • 'glass'          -> frosted, see-through glass panel
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
