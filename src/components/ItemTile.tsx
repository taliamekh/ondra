import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
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

/**
 * Square thumbnail for a garment.
 *
 * Shows ONLY a real photo of the item — one that came from a camera scan, a
 * pasted product link's og:image, or the catalog. If there is no real photo (or
 * it fails to load), it shows the clean themed garment icon. We never substitute
 * a generic / stock image, because that would show something that isn't the item.
 */
export function ItemTile({ imageUrl, color, category = 'other', size = 80, radius, style }: Props) {
  const theme = useTheme();
  const r = radius ?? theme.radius.md;
  const [failed, setFailed] = useState(false);

  // Reset the error state if the URL changes (tile reused in a list).
  useEffect(() => setFailed(false), [imageUrl]);

  if (imageUrl && !failed) {
    return (
      <Image
        source={{ uri: imageUrl }}
        onError={() => setFailed(true)}
        style={[{ width: size, height: size, borderRadius: r, backgroundColor: theme.colors.bgInset }, style as object]}
        contentFit="cover"
        transition={150}
      />
    );
  }

  // No real photo -> clean themed icon (not a stock photo).
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
