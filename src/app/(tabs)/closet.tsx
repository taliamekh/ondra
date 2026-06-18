import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import { Brand } from '@/components/Brand';
import { EmptyState } from '@/components/EmptyState';
import { GarmentIcon } from '@/components/GarmentIcon';
import { ItemCard } from '@/components/ItemCard';
import { ThemeMotif } from '@/components/ThemeMotif';
import { Button, Chip, IconButton, Screen, Text } from '@/components/ui';
import { CATEGORIES, categoryById, type CategoryId } from '@/constants/catalog';
import { useData } from '@/data/DataProvider';
import { STARTER_CLOSET } from '@/data/fixtures';
import { useFocusQuery } from '@/hooks/useFocusQuery';
import { readableOn } from '@/lib/colors';
import { MaxContentWidth, Spacing, useTheme } from '@/theme';

export default function Closet() {
  const theme = useTheme();
  const router = useRouter();
  const { repo, profile } = useData();
  const { width } = useWindowDimensions();

  const { data: items, loading, reload } = useFocusQuery(() => repo.listItems(), [repo]);
  const [cat, setCat] = useState<'all' | CategoryId>('all');
  const [seeding, setSeeding] = useState(false);

  const contentW = Math.min(width, MaxContentWidth) - Spacing.three * 2;
  const cols = contentW > 620 ? 4 : contentW > 440 ? 3 : 2;
  const gap = 12;
  const cardW = (contentW - gap * (cols - 1)) / cols;

  const usedCats = useMemo(
    () => CATEGORIES.filter((c) => (items ?? []).some((i) => i.category === c.id)),
    [items],
  );
  const filtered = (items ?? []).filter((i) => cat === 'all' || i.category === cat);

  const addStarter = async () => {
    setSeeding(true);
    try {
      await repo.createItems(STARTER_CLOSET);
      reload();
    } finally {
      setSeeding(false);
    }
  };

  const heroText = readableOn(theme.gradient[0]);
  const empty = !loading && (items?.length ?? 0) === 0;

  return (
    <Screen scroll>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.three }}>
        <View>
          <Text variant="caption" muted>
            Hi {profile?.displayName ?? 'there'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Brand size={26} />
            <Text variant="heading">closet</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <IconButton icon="camera-outline" variant="surface" onPress={() => router.push('/scan')} />
          <IconButton icon="add" variant="solid" onPress={() => router.push('/item/new')} />
        </View>
      </View>

      {/* Style-me hero */}
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: theme.radius.xl, padding: Spacing.four, marginBottom: Spacing.four }}>
        {/* Themes with a creature (Rubber Duck / Cat) show it here in the hero. */}
        {theme.motif ? (
          <View style={{ position: 'absolute', right: 14, top: 14 }}>
            <ThemeMotif motif={theme.motif} size={60} />
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="sparkles" size={18} color={heroText} />
          <Text variant="subtitle" color={heroText}>
            Style me today
          </Text>
        </View>
        <Text variant="body" color={heroText} style={{ opacity: 0.85, marginTop: 2, marginBottom: 14 }}>
          Outfit ideas for the weather & your plans.
        </Text>
        <Button title="Build an outfit" icon="sparkles" variant="secondary" size="sm" onPress={() => router.push('/outfits')} style={{ alignSelf: 'flex-start' }} />
      </LinearGradient>

      {empty ? (
        <EmptyState
          icon="shirt-outline"
          title="Your closet is empty"
          subtitle="Add a few pieces and Onda will start styling outfits for you.">
          <Button title="Add a starter closet" icon="sparkles" onPress={addStarter} loading={seeding} full />
          <Button title="Scan an item" icon="camera-outline" variant="secondary" onPress={() => router.push('/scan')} full />
          <Button title="Add manually" icon="create-outline" variant="ghost" onPress={() => router.push('/item/new')} full />
        </EmptyState>
      ) : (
        <>
          {/* Category filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: Spacing.three }}>
            <Chip
              label="All"
              leading={(col) => <Ionicons name="apps-outline" size={15} color={col} />}
              selected={cat === 'all'}
              onPress={() => setCat('all')}
              size="sm"
            />
            {usedCats.map((c) => (
              <Chip
                key={c.id}
                label={c.label}
                leading={(col) => <GarmentIcon category={c.id} color={col} size={16} />}
                selected={cat === c.id}
                onPress={() => setCat(c.id)}
                size="sm"
              />
            ))}
          </ScrollView>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} width={cardW} onPress={() => router.push(`/item/${item.id}`)} />
            ))}
          </View>

          {!loading && filtered.length === 0 ? (
            <Text variant="body" muted center style={{ marginTop: 24 }}>
              Nothing in {cat === 'all' ? 'your closet' : categoryById(cat).label.toLowerCase()} yet.
            </Text>
          ) : null}
        </>
      )}
    </Screen>
  );
}
