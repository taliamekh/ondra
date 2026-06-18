import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Switch, View } from 'react-native';

import { ItemTile } from '@/components/ItemTile';
import { OutfitStage } from '@/components/OutfitStage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button, Card, Chip, IconButton, Screen, Text } from '@/components/ui';
import { BACKGROUNDS, occasionById, type BackgroundId } from '@/constants/catalog';
import { useData } from '@/data/DataProvider';
import { useFocusQuery } from '@/hooks/useFocusQuery';
import { affiliateUrl } from '@/lib/affiliate';
import { Spacing, useTheme } from '@/theme';

export default function OutfitDetail() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { repo } = useData();

  const { data: outfits } = useFocusQuery(() => repo.listOutfits(), [repo]);
  const outfit = outfits?.find((o) => o.id === id);

  const [bg, setBg] = useState<BackgroundId | undefined>(undefined);
  const [isPublic, setIsPublic] = useState<boolean | undefined>(undefined);

  if (!outfit) {
    return (
      <Screen>
        <ScreenHeader title="Outfit" />
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  const background = bg ?? outfit.background;
  const publicState = isPublic ?? outfit.isPublic;

  const changeBackground = (next: BackgroundId) => {
    setBg(next);
    repo.updateOutfit(outfit.id, { background: next }).catch(() => {});
  };
  const togglePublic = (next: boolean) => {
    setIsPublic(next);
    repo.updateOutfit(outfit.id, { isPublic: next }).catch(() => {});
  };
  const remove = async () => {
    await repo.deleteOutfit(outfit.id);
    router.back();
  };
  const buy = (url?: string | null) => {
    const a = affiliateUrl(url);
    if (a) WebBrowser.openBrowserAsync(a).catch(() => {});
  };

  return (
    <Screen scroll>
      <ScreenHeader
        title={outfit.title}
        right={<IconButton icon="trash-outline" color={theme.colors.danger} onPress={remove} />}
      />

      {/* Staged avatar viewer */}
      <OutfitStage items={outfit.items.map((i) => i.snapshot)} background={background} figure height={340} tile={84} />

      {/* Background switcher */}
      <View style={{ marginTop: Spacing.three }}>
        <Text variant="label" muted style={{ marginBottom: 8 }}>
          Backdrop
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {BACKGROUNDS.map((b) => (
            <Chip key={b.id} label={b.label} selected={background === b.id} onPress={() => changeBackground(b.id)} size="sm" />
          ))}
        </ScrollView>
      </View>

      {/* Meta */}
      <Card style={{ marginTop: Spacing.three, gap: 10 }}>
        {outfit.occasion ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name={occasionById(outfit.occasion).icon} size={18} color={theme.colors.primary} />
            <Text variant="body">
              {occasionById(outfit.occasion).label}
              {outfit.weather ? ` · ${outfit.weather.tempC}° ${outfit.weather.condition}` : ''}
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text variant="label">Share to feed</Text>
            <Text variant="caption" muted>
              Make this look public so others in your style can find it.
            </Text>
          </View>
          <Switch
            value={publicState}
            onValueChange={togglePublic}
            trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
          />
        </View>
      </Card>

      {/* Items / shop the look */}
      <Text variant="heading" style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}>
        In this look
      </Text>
      <View style={{ gap: 10 }}>
        {outfit.items.map((it) => {
          const s = it.snapshot;
          return (
            <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <ItemTile imageUrl={s.imageUrl} color={s.colors?.[0]} category={s.category ?? 'other'} size={50} />
              <View style={{ flex: 1 }}>
                <Text variant="label" numberOfLines={1}>
                  {s.name}
                </Text>
                <Text variant="caption" muted numberOfLines={1}>
                  {it.isOwned ? 'In your closet' : (s.brand ?? s.source)}
                  {s.price != null ? ` · $${s.price}` : ''}
                </Text>
              </View>
              {s.buyUrl && s.inStock !== false ? (
                <Button title="Buy" icon="open-outline" iconRight size="sm" variant="outline" onPress={() => buy(s.buyUrl)} />
              ) : null}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
