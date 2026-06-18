import { LinearGradient } from 'expo-linear-gradient';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { backgroundById, categoryById, type BackgroundId } from '@/constants/catalog';
import { useTheme } from '@/theme';

import { ItemTile } from './ItemTile';
import { OutfitCollage } from './OutfitCollage';

interface StageItem {
  imageUrl?: string | null;
  colors?: string[] | null;
  category?: string | null;
}

interface Props {
  items: StageItem[];
  background?: BackgroundId;
  height?: number;
  /** figure = stack pieces head→shoes like an outfit on a stand; else flat collage. */
  figure?: boolean;
  tile?: number;
  style?: StyleProp<ViewStyle>;
}

const SLOT_ORDER = ['head', 'outerwear', 'top', 'full', 'bottom', 'shoes', 'bag', 'accessory'];
const slotIdx = (category?: string | null) =>
  SLOT_ORDER.indexOf(categoryById(category ?? 'other').slot);

/**
 * Renders an outfit on a chosen background. Doubles as the staged preview for
 * the (future 3D) avatar viewer — backgrounds map to white / red carpet / café /
 * garden, etc.
 */
export function OutfitStage({ items, background = 'white', height = 240, figure = true, tile = 76, style }: Props) {
  const theme = useTheme();
  const bg = backgroundById(background);
  const ordered = figure ? [...items].sort((a, b) => slotIdx(a.category) - slotIdx(b.category)) : items;

  return (
    <LinearGradient
      colors={bg.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        { borderRadius: theme.radius.xl, minHeight: height, padding: 16, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}>
      {figure ? (
        <View style={{ alignItems: 'center', gap: 8 }}>
          {ordered.map((it, i) => (
            <ItemTile key={i} imageUrl={it.imageUrl} color={it.colors?.[0]} category={it.category ?? 'other'} size={tile} />
          ))}
        </View>
      ) : (
        <OutfitCollage items={items} tile={tile} style={{ justifyContent: 'center' }} />
      )}
    </LinearGradient>
  );
}
