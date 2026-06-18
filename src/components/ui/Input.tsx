import { TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

interface Props extends TextInputProps {
  label?: string;
}

export function Input({ label, style, ...rest }: Props) {
  const theme = useTheme();
  const c = theme.colors;

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text variant="label" muted>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={c.textMuted}
        style={[
          {
            backgroundColor: c.bgInset,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: c.border,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: c.text,
            fontSize: 15,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}
