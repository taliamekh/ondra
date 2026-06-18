import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { BottomTabInset, Spacing, useTheme } from '@/theme';

import { MetallicLayers } from './surfaces';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * Themed, safe-area-aware screen container used by every screen. The whole-app
 * BACKGROUND is themed here:
 *   • Metallic -> the entire background is brushed metal (softer glint so cards pop)
 *   • Glass    -> a colorful gradient (so the frosted glass cards have color to refract)
 *   • others   -> a solid theme color
 */
export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['top'],
  style,
  contentContainerStyle,
}: Props) {
  const theme = useTheme();
  const isMetal = theme.surface === 'metallic';
  const isGlass = theme.surface === 'glass';
  const pad = padded ? { padding: Spacing.three } : null;

  const content = (
    <SafeAreaView edges={edges} style={{ flex: 1 }}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[pad, { paddingBottom: BottomTabInset + Spacing.six }, contentContainerStyle]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );

  // Metallic: the background itself is brushed metal.
  if (isMetal) {
    return (
      <View style={[{ flex: 1, backgroundColor: '#D9DEE4' }, style]}>
        <MetallicLayers gloss={0.28} />
        {content}
      </View>
    );
  }

  // Glass: colorful gradient behind the frosted cards.
  if (isGlass) {
    return (
      <LinearGradient colors={theme.gradient} style={[{ flex: 1 }, style]}>
        {content}
      </LinearGradient>
    );
  }

  // Flat themes: solid background color.
  return <View style={[{ flex: 1, backgroundColor: theme.colors.bg }, style]}>{content}</View>;
}
