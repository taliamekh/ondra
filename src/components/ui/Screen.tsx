import { type ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { BottomTabInset, Spacing, useTheme } from '@/theme';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/** Themed, safe-area-aware screen container. Set `scroll` for scrolling content. */
export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['top'],
  style,
  contentContainerStyle,
}: Props) {
  const theme = useTheme();
  const pad = padded ? { padding: Spacing.three } : null;

  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.bg }, style]}>
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
    </View>
  );
}
