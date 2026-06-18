import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { ItemEditor } from '@/components/ItemEditor';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Screen } from '@/components/ui';
import { useData } from '@/data/DataProvider';
import type { NewClothingItem } from '@/data/repository';
import { useFocusQuery } from '@/hooks/useFocusQuery';
import { useTheme } from '@/theme';

export default function EditItem() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { repo } = useData();

  const { data: items } = useFocusQuery(() => repo.listItems(), [repo]);
  const item = items?.find((i) => i.id === id);
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(undefined);
  const effectiveImage = imageUrl !== undefined ? imageUrl : (item?.imageUrl ?? null);

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!res.canceled && res.assets[0]) setImageUrl(res.assets[0].uri);
  };

  const save = async (values: NewClothingItem) => {
    if (!item) return;
    await repo.updateItem(item.id, { ...values, imageUrl: effectiveImage });
    router.back();
  };
  const del = async () => {
    if (!item) return;
    await repo.deleteItem(item.id);
    router.back();
  };

  return (
    <Screen scroll>
      <ScreenHeader title="Edit item" />
      {!item ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ItemEditor
          key={item.id}
          initial={{
            name: item.name,
            category: item.category,
            brand: item.brand,
            price: item.price,
            source: item.source,
            buyUrl: item.buyUrl,
            colors: item.colors,
            inStock: item.inStock,
            isWishlist: item.isWishlist,
            warmth: item.warmth,
            formality: item.formality,
            seasons: item.seasons,
            occasions: item.occasions,
            styleTags: item.styleTags,
            imageUrl: effectiveImage,
          }}
          onPickPhoto={pickPhoto}
          onSubmit={save}
          onDelete={del}
          submitLabel="Save changes"
        />
      )}
    </Screen>
  );
}
