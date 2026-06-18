import { View, type StyleProp, type ViewStyle } from 'react-native';

import { categoryById } from '@/constants/catalog';

import { ItemTile } from './ItemTile';

interface CollageItem {
  imageUrl?: string | null;
  colors?: string[] | null;
  category?: string | null;
}

interface Props {
  items: CollageItem[];
  tile?: number;
  style?: StyleProp<ViewStyle>;
}

/** A wrapped row of garment tiles representing an outfit. */
export function OutfitCollage({ items, tile = 64, style }: Props) {
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, style]}>
      {items.map((it, i) => (
        <ItemTile
          key={i}
          imageUrl={it.imageUrl}
          color={it.colors?.[0]}
          emoji={categoryById(it.category ?? 'other').emoji}
          size={tile}
        />
      ))}
    </View>
  );
}
