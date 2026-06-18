import { useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';

import { CATEGORIES, categoryById, type CategoryId, type OccasionId, type SeasonId } from '@/constants/catalog';
import type { StyleId } from '@/constants/catalog';
import { isHex } from '@/lib/colors';
import { Spacing, useTheme } from '@/theme';
import type { NewClothingItem } from '@/data/repository';

import { ItemTile } from './ItemTile';
import { Button, Card, Chip, Input, Text } from './ui';

const PRESET_COLORS = [
  '#1A1A1A', '#FFFFFF', '#9CA3AF', '#7C97B8', '#3E9BDD', '#56C596',
  '#B5703F', '#C98AA6', '#FF6FA5', '#8B5CF6', '#C81E33', '#F5C518',
];

export interface ItemEditorInitial {
  name?: string;
  category?: CategoryId;
  brand?: string | null;
  price?: number | null;
  source?: string | null;
  buyUrl?: string | null;
  colors?: string[];
  inStock?: boolean;
  isWishlist?: boolean;
  warmth?: number;
  formality?: number;
  imageUrl?: string | null;
  seasons?: SeasonId[];
  occasions?: OccasionId[];
  styleTags?: StyleId[];
}

interface Props {
  initial?: ItemEditorInitial;
  submitLabel?: string;
  onSubmit: (values: NewClothingItem) => Promise<void>;
  onDelete?: () => Promise<void>;
  onPickPhoto?: () => void;
}

function Scale({ value, onChange, labels }: { value: number; onChange: (n: number) => void; labels: [string, string] }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const sel = n === value;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              style={{
                flex: 1,
                height: 38,
                borderRadius: theme.radius.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: sel ? theme.colors.primary : theme.colors.bgInset,
              }}>
              <Text variant="label" color={sel ? theme.colors.onPrimary : theme.colors.textMuted}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="caption" muted>
          {labels[0]}
        </Text>
        <Text variant="caption" muted>
          {labels[1]}
        </Text>
      </View>
    </View>
  );
}

export function ItemEditor({ initial = {}, submitLabel = 'Save item', onSubmit, onDelete, onPickPhoto }: Props) {
  const theme = useTheme();
  const [name, setName] = useState(initial.name ?? '');
  const [category, setCategory] = useState<CategoryId>(initial.category ?? 'top');
  const [brand, setBrand] = useState(initial.brand ?? '');
  const [price, setPrice] = useState(initial.price != null ? String(initial.price) : '');
  const [source, setSource] = useState(initial.source ?? '');
  const [buyUrl, setBuyUrl] = useState(initial.buyUrl ?? '');
  const [colors, setColors] = useState<string[]>(initial.colors ?? []);
  const [inStock, setInStock] = useState(initial.inStock ?? true);
  const [isWishlist, setIsWishlist] = useState(initial.isWishlist ?? false);
  const [warmth, setWarmth] = useState(initial.warmth ?? 3);
  const [formality, setFormality] = useState(initial.formality ?? 3);
  const [saving, setSaving] = useState(false);

  const toggleColor = (hex: string) =>
    setColors((prev) => (prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]));

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        name: name.trim() || 'Untitled item',
        category,
        brand: brand.trim() || null,
        price: price ? Number(price) : null,
        currency: 'USD',
        source: source.trim() || null,
        buyUrl: buyUrl.trim() || null,
        colors,
        inStock,
        isWishlist,
        warmth,
        formality,
        imageUrl: initial.imageUrl ?? null,
        seasons: initial.seasons ?? [],
        occasions: initial.occasions ?? [],
        styleTags: initial.styleTags ?? [],
      });
    } catch {
      setSaving(false);
    }
  };

  return (
    <View style={{ gap: Spacing.three }}>
      {/* Photo */}
      <View style={{ alignItems: 'center', gap: 10 }}>
        <ItemTile
          imageUrl={initial.imageUrl}
          color={colors.find(isHex)}
          emoji={categoryById(category).emoji}
          size={140}
          radius={theme.radius.xl}
        />
        {onPickPhoto ? (
          <Button title={initial.imageUrl ? 'Change photo' : 'Add photo'} icon="image-outline" variant="ghost" size="sm" onPress={onPickPhoto} />
        ) : null}
      </View>

      <Input label="Name" placeholder="e.g. Cropped denim jacket" value={name} onChangeText={setName} />

      <View style={{ gap: 6 }}>
        <Text variant="label" muted>
          Category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={c.label} emoji={c.emoji} selected={category === c.id} onPress={() => setCategory(c.id)} size="sm" />
          ))}
        </ScrollView>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Input label="Brand" placeholder="Brand" value={brand} onChangeText={setBrand} />
        </View>
        <View style={{ width: 110 }}>
          <Input label="Price ($)" placeholder="0" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
        </View>
      </View>

      <Input label="Bought from" placeholder="e.g. Aritzia" value={source} onChangeText={setSource} />
      <Input label="Buy link" placeholder="https://…" value={buyUrl} onChangeText={setBuyUrl} autoCapitalize="none" keyboardType="url" />

      <View style={{ gap: 8 }}>
        <Text variant="label" muted>
          Colors
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {PRESET_COLORS.map((hex) => {
            const sel = colors.includes(hex);
            return (
              <Pressable
                key={hex}
                onPress={() => toggleColor(hex)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: hex,
                  borderWidth: sel ? 3 : 1,
                  borderColor: sel ? theme.colors.primary : theme.colors.border,
                }}
              />
            );
          })}
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <Text variant="label" muted>
          Warmth
        </Text>
        <Scale value={warmth} onChange={setWarmth} labels={['Light', 'Warm']} />
      </View>
      <View style={{ gap: 6 }}>
        <Text variant="label" muted>
          Formality
        </Text>
        <Scale value={formality} onChange={setFormality} labels={['Casual', 'Formal']} />
      </View>

      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text variant="label">Still sold</Text>
            <Text variant="caption" muted>
              Turn off if it&apos;s no longer available at the source.
            </Text>
          </View>
          <Switch
            value={inStock}
            onValueChange={setInStock}
            trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text variant="label">Wishlist</Text>
            <Text variant="caption" muted>
              A piece you want to buy, not something you own yet.
            </Text>
          </View>
          <Switch
            value={isWishlist}
            onValueChange={setIsWishlist}
            trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
          />
        </View>
      </Card>

      <Button title={submitLabel} icon="checkmark" onPress={submit} loading={saving} full size="lg" />
      {onDelete ? <Button title="Delete item" icon="trash-outline" variant="danger" onPress={onDelete} full /> : null}
    </View>
  );
}
