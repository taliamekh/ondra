import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { ItemEditor, type ItemEditorInitial } from '@/components/ItemEditor';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Screen } from '@/components/ui';
import type { CategoryId, OccasionId, SeasonId, StyleId } from '@/constants/catalog';
import { useData } from '@/data/DataProvider';
import type { NewClothingItem } from '@/data/repository';

const csv = (v?: string) => (v ? v.split(',').filter(Boolean) : []);

export default function NewItem() {
  const router = useRouter();
  const { repo } = useData();
  const p = useLocalSearchParams<Record<string, string>>();
  const [imageUrl, setImageUrl] = useState<string | null>(p.image ?? null);

  const initial: ItemEditorInitial = {
    name: p.name,
    category: (p.category as CategoryId) ?? 'top',
    brand: p.brand ?? null,
    price: p.price ? Number(p.price) : null,
    source: p.source ?? null,
    buyUrl: p.buyUrl ?? null,
    colors: csv(p.colors),
    inStock: p.inStock !== 'false',
    warmth: p.warmth ? Number(p.warmth) : 3,
    formality: p.formality ? Number(p.formality) : 3,
    seasons: csv(p.seasons) as SeasonId[],
    occasions: csv(p.occasions) as OccasionId[],
    styleTags: csv(p.styleTags) as StyleId[],
    imageUrl,
  };

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!res.canceled && res.assets[0]) setImageUrl(res.assets[0].uri);
  };

  const save = async (values: NewClothingItem) => {
    await repo.createItem({ ...values, imageUrl });
    router.back();
  };

  return (
    <Screen scroll>
      <ScreenHeader title={p.name ? 'Confirm item' : 'Add item'} closeIcon="close" />
      <ItemEditor initial={{ ...initial, imageUrl }} onPickPhoto={pickPhoto} onSubmit={save} submitLabel="Add to closet" />
    </Screen>
  );
}
