import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { isHex } from '@/lib/colors';
import { useTheme } from '@/theme';

import { Text } from './ui';

interface Props {
  imageUrl?: string | null;
  color?: string | null;
  emoji?: string;
  size?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Square thumbnail for a garment — a photo if available, else a colored tile. */
export function ItemTile({ imageUrl, color, emoji = '👗', size = 80, radius, style }: Props) {
  const theme = useTheme();
  const r = radius ?? theme.radius.md;

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[{ width: size, height: size, borderRadius: r, backgroundColor: theme.colors.bgInset }, style as object]}
        contentFit="cover"
        transition={150}
      />
    );
  }

  const bg = isHex(color) ? color : theme.colors.bgInset;
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: r, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}>
      <Text style={{ fontSize: size * 0.42 }}>{emoji}</Text>
    </View>
  );
}
