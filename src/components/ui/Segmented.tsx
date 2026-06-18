import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

interface Props<T extends string> {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}

export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.bgInset,
        borderRadius: theme.radius.pill,
        padding: 4,
      }}>
      {options.map((o) => {
        const selected = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={{
              flex: 1,
              height: 38,
              borderRadius: theme.radius.pill,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? theme.colors.bgAlt : 'transparent',
            }}>
            <Text variant="label" color={selected ? theme.colors.text : theme.colors.textMuted}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
