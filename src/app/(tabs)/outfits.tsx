import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { OutfitCollage } from '@/components/OutfitCollage';
import { Button, Card, Chip, IconButton, Screen, Segmented, Text } from '@/components/ui';
import { occasionById, OCCASIONS, type OccasionId } from '@/constants/catalog';
import { useData } from '@/data/DataProvider';
import { useFocusQuery } from '@/hooks/useFocusQuery';
import { generateOutfits, itemToSnapshot, type GeneratedOutfit } from '@/lib/generator';
import { getDeviceWeather, type WeatherNow } from '@/lib/weather';
import { Spacing, useTheme } from '@/theme';

function WeatherBar({ weather, loading, onRefresh }: { weather: WeatherNow | null; loading: boolean; onRefresh: () => void }) {
  const theme = useTheme();
  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Ionicons name={(weather?.icon ?? 'partly-sunny-outline') as any} size={32} color={theme.colors.primary} />
      <View style={{ flex: 1 }}>
        {loading && !weather ? (
          <Text variant="body" muted>
            Getting your weather…
          </Text>
        ) : weather ? (
          <>
            <Text variant="subtitle">
              {weather.tempC}° · {weather.label}
            </Text>
            <Text variant="caption" muted>
              {weather.city ? `${weather.city} · ` : ''}feels {weather.feelsLikeC}° · H{weather.high}° L{weather.low}°
            </Text>
          </>
        ) : (
          <Text variant="body" muted>
            Weather unavailable
          </Text>
        )}
      </View>
      <IconButton icon="refresh" variant="surface" size={18} onPress={onRefresh} />
    </Card>
  );
}

export default function Outfits() {
  const theme = useTheme();
  const router = useRouter();
  const { repo, profile } = useData();

  const [tab, setTab] = useState<'today' | 'saved'>('today');
  const [weather, setWeather] = useState<WeatherNow | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [occasion, setOccasion] = useState<OccasionId>('casual');
  const [seed, setSeed] = useState(0);
  const [results, setResults] = useState<GeneratedOutfit[] | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const { data: items } = useFocusQuery(() => repo.listItems(), [repo]);
  const saved = useFocusQuery(() => repo.listOutfits(), [repo]);

  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      setWeather(await getDeviceWeather(profile?.location));
    } catch {
      // ignore — generator still works without weather
    } finally {
      setWeatherLoading(false);
    }
  }, [profile?.location]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  const generate = useCallback(
    (occ: OccasionId, s: number) => {
      setResults(generateOutfits(items ?? [], { occasion: occ, weather, styleTypes: profile?.styleTypes ?? [], seed: s }));
    },
    [items, weather, profile?.styleTypes],
  );

  // Auto-generate once the closet is loaded.
  useEffect(() => {
    if (items && results === null) generate(occasion, seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const onOccasion = (occ: OccasionId) => {
    setOccasion(occ);
    setSeed(0);
    generate(occ, 0);
  };
  const regenerate = () => {
    const s = seed + 1;
    setSeed(s);
    generate(occasion, s);
  };

  const save = async (o: GeneratedOutfit) => {
    await repo.createOutfit({
      title: o.title,
      occasion,
      weather,
      background: 'white',
      source: 'generated',
      items: o.items.map((it, i) => ({
        clothingItemId: it.id,
        isOwned: true,
        slot: it.category,
        layer: i,
        snapshot: itemToSnapshot(it),
      })),
    });
    setSavedIds((prev) => new Set(prev).add(o.id));
    saved.reload();
  };

  const closetEmpty = (items?.length ?? 0) === 0;

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.three }}>
        <Text variant="title">Outfits</Text>
      </View>

      <Segmented
        options={[
          { key: 'today', label: 'Style me' },
          { key: 'saved', label: `Saved${saved.data?.length ? ` (${saved.data.length})` : ''}` },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'today' ? (
        <View style={{ gap: Spacing.three, marginTop: Spacing.three }}>
          <WeatherBar weather={weather} loading={weatherLoading} onRefresh={loadWeather} />

          {/* Occasion picker */}
          <View>
            <Text variant="label" muted style={{ marginBottom: 8 }}>
              What&apos;s the occasion?
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {OCCASIONS.map((o) => (
                <Chip
                  key={o.id}
                  label={o.label}
                  leading={(col) => <Ionicons name={o.icon} size={15} color={col} />}
                  selected={occasion === o.id}
                  onPress={() => onOccasion(o.id)}
                  size="sm"
                />
              ))}
            </ScrollView>
          </View>

          {closetEmpty ? (
            <EmptyState icon="shirt-outline" title="Add clothes to get outfits" subtitle="Onda builds looks from items in your closet.">
              <Button title="Go to closet" icon="shirt" onPress={() => router.push('/closet')} full />
            </EmptyState>
          ) : (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="heading">
                  {results?.length ? `${results.length} looks for you` : 'Tap regenerate'}
                </Text>
                <Button title="Regenerate" icon="shuffle" variant="secondary" size="sm" onPress={regenerate} />
              </View>

              {results && results.length === 0 ? (
                <Text variant="body" muted center style={{ paddingVertical: 24 }}>
                  No {occasionById(occasion).label.toLowerCase()} looks from your current closet — try adding a
                  top, bottom & shoes for this occasion.
                </Text>
              ) : null}

              {(results ?? []).map((o) => {
                const isSaved = savedIds.has(o.id);
                return (
                  <Card key={o.id} style={{ gap: 12 }}>
                    <OutfitCollage items={o.items} tile={70} />
                    <View>
                      <Text variant="subtitle">{o.title}</Text>
                      <View style={{ marginTop: 4, gap: 2 }}>
                        {o.rationale.map((r, i) => (
                          <Text key={i} variant="caption" muted>
                            • {r}
                          </Text>
                        ))}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Button
                        title={isSaved ? 'Saved' : 'Save look'}
                        icon={isSaved ? 'checkmark' : 'bookmark-outline'}
                        variant={isSaved ? 'secondary' : 'primary'}
                        size="sm"
                        onPress={() => !isSaved && save(o)}
                        style={{ flex: 1 }}
                      />
                    </View>
                  </Card>
                );
              })}
            </>
          )}
        </View>
      ) : (
        <View style={{ gap: Spacing.three, marginTop: Spacing.three }}>
          {saved.loading && !saved.data ? (
            <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
          ) : (saved.data?.length ?? 0) === 0 ? (
            <EmptyState icon="albums-outline" title="No saved outfits yet" subtitle="Generate looks and tap Save to keep them here." />
          ) : (
            saved.data!.map((o) => (
              <Card key={o.id} onPress={() => router.push(`/outfit/${o.id}`)} style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="subtitle" numberOfLines={1} style={{ flex: 1 }}>
                    {o.title}
                  </Text>
                  {o.isPublic ? <Text variant="caption" color={theme.colors.primary}>Public</Text> : null}
                </View>
                <OutfitCollage items={o.items.map((it) => it.snapshot)} tile={58} />
              </Card>
            ))
          )}
        </View>
      )}
    </Screen>
  );
}
