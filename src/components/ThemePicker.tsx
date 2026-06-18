import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';

import { THEME_ORDER, THEMES, useTheme, type ThemeKey } from '@/theme';

import { Text } from './ui';

interface Props {
  value: ThemeKey;
  onSelect: (key: ThemeKey) => void;
}

/** Grid of theme swatches. Used in onboarding and Profile settings. */
export function ThemePicker({ value, onSelect }: Props) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {THEME_ORDER.map((key) => {
        const t = THEMES[key];
        const selected = key === value;
        return (
          <Pressable key={key} onPress={() => onSelect(key)} style={{ flexBasis: '47%', flexGrow: 1 }}>
            <View
              style={{
                borderRadius: theme.radius.lg,
                borderWidth: selected ? 2.5 : 1,
                borderColor: selected ? theme.colors.primary : theme.colors.border,
                backgroundColor: theme.colors.bgAlt,
                overflow: 'hidden',
              }}>
              <LinearGradient colors={t.gradient} style={{ height: 60, justifyContent: 'flex-end', padding: 8 }}>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  {[t.colors.primary, t.colors.secondary, t.colors.accent].map((col, i) => (
                    <View
                      key={i}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: col,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.08)',
                      }}
                    />
                  ))}
                </View>
              </LinearGradient>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text variant="label">{t.name}</Text>
                {selected ? <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} /> : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
