import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { GlassLayers, MetallicLayers } from '@/components/ui/surfaces';
import { Font, useTheme } from '@/theme';

export default function TabsLayout() {
  const theme = useTheme();
  const c = theme.colors;
  const isMetal = theme.surface === 'metallic';
  const isGlass = theme.surface === 'glass';
  const textured = isMetal || isGlass;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        // On Metallic/Glass the menu bar shows the material; otherwise a solid color.
        tabBarStyle: {
          backgroundColor: textured ? 'transparent' : c.bgAlt,
          borderTopColor: c.border,
        },
        tabBarBackground: textured
          ? () => (isGlass ? <GlassLayers dark={theme.mode === 'dark'} /> : <MetallicLayers />)
          : undefined,
        tabBarLabelStyle: { fontSize: 11, fontFamily: Font.semibold },
      }}>
      <Tabs.Screen
        name="closet"
        options={{ title: 'Closet', tabBarIcon: ({ color, size }) => <Ionicons name="shirt" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="outfits"
        options={{ title: 'Outfits', tabBarIcon: ({ color, size }) => <Ionicons name="sparkles" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="feed"
        options={{ title: 'Feed', tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="boards"
        options={{ title: 'Boards', tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'You', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }}
      />
    </Tabs>
  );
}
