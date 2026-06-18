import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { isHex, readableOn } from '@/lib/colors';
import { seedFromString, stockImage } from '@/lib/stockImage';
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

/**
 * Square thumbnail for a garment. Shows, in order of preference:
 *   1. the item's real photo (from a scan / pasted link / catalog),
 *   2. a representative clothing photo for its category (placeholder),
 *   3. the themed garment icon (only if both images fail to load).
 */
export function ItemTile({ imageUrl, color, category = 'other', size = 80, radius, style }: Props) {
  const theme = useTheme();
  const r = radius ?? theme.radius.md;

  // A stable placeholder photo for this item (same item -> same photo).
  const stock = stockImage(category, seedFromString((isHex(color) ? (color as string) : '') + category));

  const [stage, setStage] = useState<'primary' | 'stock' | 'icon'>(imageUrl ? 'primary' : 'stock');
  useEffect(() => setStage(imageUrl ? 'primary' : 'stock'), [imageUrl]);

  const uri = stage === 'primary' ? imageUrl : stage === 'stock' ? stock : null;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        onError={() => setStage((s) => (s === 'primary' ? 'stock' : 'icon'))}
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
