import { Pressable, View } from 'react-native';

import { categoryById } from '@/constants/catalog';
import { tileColor } from '@/lib/colors';
import { Font, useTheme } from '@/theme';
import type { ClothingItem } from '@/types/models';

import { ItemTile } from './ItemTile';
import { Text } from './ui';

interface Props {
  item: ClothingItem;
  width: number;
  onPress?: () => void;
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 6,
        left: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: bg,
      }}>
      <Text style={{ fontSize: 10, fontFamily: Font.bold, color }}>{label}</Text>
    </View>
  );
}

export function ItemCard({ item, width, onPress }: Props) {
  const theme = useTheme();
  const cat = categoryById(item.category);

  return (
    <Pressable onPress={onPress} style={{ width }}>
      <View>
        <ItemTile
          imageUrl={item.imageUrl}
          color={tileColor(item.colors)}
          category={item.category}
          size={width}
          radius={theme.radius.lg}
        />
        {item.isWishlist ? <Badge label="WISHLIST" color={theme.colors.onPrimary} bg={theme.colors.primary} /> : null}
        {!item.inStock ? <Badge label="SOLD OUT" color="#FFFFFF" bg="rgba(0,0,0,0.6)" /> : null}
      </View>
      <Text variant="label" numberOfLines={1} style={{ marginTop: 6 }}>
        {item.name}
      </Text>
      <Text variant="caption" muted numberOfLines={1}>
        {item.brand ?? cat.label}
        {item.price != null ? ` · $${item.price}` : ''}
      </Text>
    </Pressable>
  );
}
