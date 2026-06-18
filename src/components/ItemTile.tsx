import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { isHex, readableOn } from '@/lib/colors';
import { useTheme } from '@/theme';

import { GarmentIcon } from './GarmentIcon';

interface Props {
  imageUrl?: string | null;
  color?: string | null;
  category?: string;
  size?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Square thumbnail for a garment — a photo if available, else a colored tile
 *  with the category's garment icon. */
export function ItemTile({ imageUrl, color, category = 'other', size = 80, radius, style }: Props) {
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

  const hasColor = isHex(color);
  const bg = hasColor ? (color as string) : theme.colors.bgInset;
  const iconColor = hasColor ? readableOn(color as string) : theme.colors.textMuted;

  return (
    <View
      style={[
        { width: size, height: size, borderRadius: r, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}>
      <GarmentIcon
        category={category}
        color={iconColor}
        size={Math.round(size * 0.5)}
        strokeWidth={Math.max(1.4, size * 0.02)}
      />
    </View>
  );
}
