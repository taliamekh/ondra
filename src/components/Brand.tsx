import { Font, useTheme } from '@/theme';

import { Text } from './ui';

/** The Onda wordmark. */
export function Brand({ size = 26, color }: { size?: number; color?: string }) {
  const theme = useTheme();
  return (
    <Text style={{ fontSize: size, fontFamily: Font.extrabold, letterSpacing: -1, color: color ?? theme.colors.primary }}>
      onda
    </Text>
  );
}
