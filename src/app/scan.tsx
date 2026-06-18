import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';

import { ItemTile } from '@/components/ItemTile';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button, Card, Chip, Screen, Text } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

import { identifyGarment, type IdentifiedGarment, type IdentifyResult } from '@/lib/identify';
import { Spacing, useTheme } from '@/theme';

type Phase = 'capture' | 'identifying' | 'result';

export default function Scan() {
  const theme = useTheme();
  const router = useRouter();
  const [perm, requestPerm] = useCameraPermissions();
  const camRef = useRef<CameraView>(null);

  const [phase, setPhase] = useState<Phase>('capture');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [chosen, setChosen] = useState<IdentifiedGarment | null>(null);

  const run = async (uri: string | null) => {
    setImage(uri);
    setPhase('identifying');
    try {
      const r = await identifyGarment(uri ?? undefined);
      setResult(r);
      setChosen(r.best);
      setPhase('result');
    } catch {
      setPhase('capture');
    }
  };

  const capture = async () => {
    try {
      const pic = await camRef.current?.takePictureAsync({ quality: 0.6 });
      run(pic?.uri ?? null);
    } catch {
      run(null);
    }
  };

  const upload = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!res.canceled && res.assets[0]) run(res.assets[0].uri);
  };

  const addToCloset = () => {
    if (!chosen) return;
    router.replace({
      pathname: '/item/new',
      params: {
        name: chosen.name,
        category: chosen.category,
        brand: chosen.brand ?? '',
        price: chosen.price != null ? String(chosen.price) : '',
        source: chosen.source ?? '',
        buyUrl: chosen.buyUrl ?? '',
        colors: (chosen.colors ?? []).join(','),
        inStock: String(chosen.inStock),
        warmth: String(chosen.warmth),
        formality: String(chosen.formality),
        seasons: (chosen.seasons ?? []).join(','),
        occasions: (chosen.occasions ?? []).join(','),
        styleTags: (chosen.styleTags ?? []).join(','),
        image: image ?? '',
      },
    });
  };

  const canUseCamera = Platform.OS !== 'web' && perm?.granted;

  return (
    <Screen scroll>
      <ScreenHeader title="Scan an item" closeIcon="close" />

      {phase === 'capture' && (
        <View style={{ gap: Spacing.three }}>
          {canUseCamera ? (
            <View style={{ borderRadius: theme.radius.xl, overflow: 'hidden', height: 380 }}>
              <CameraView ref={camRef} style={{ flex: 1 }} facing="back" />
            </View>
          ) : (
            <Card style={{ alignItems: 'center', gap: 12, paddingVertical: 36 }}>
              <Ionicons name="camera-outline" size={48} color={theme.colors.primary} />
              <Text variant="subtitle" center>
                Snap a clothing item
              </Text>
              <Text variant="body" muted center>
                Onda recognizes the piece, then searches the web for its name, price and where to buy it.
              </Text>
              {Platform.OS !== 'web' && !perm?.granted ? (
                <Button title="Enable camera" icon="camera" onPress={requestPerm} />
              ) : null}
            </Card>
          )}

          {canUseCamera ? <Button title="Capture" icon="camera" onPress={capture} full size="lg" /> : null}
          <Button title="Upload a photo" icon="image-outline" variant="secondary" onPress={upload} full />
          <Button title="Try a demo scan" icon="sparkles" variant="ghost" onPress={() => run(null)} full />
        </View>
      )}

      {phase === 'identifying' && (
        <View style={{ alignItems: 'center', gap: 16, paddingVertical: 40 }}>
          {image ? (
            <ItemTile imageUrl={image} size={160} radius={theme.radius.xl} />
          ) : (
            <Ionicons name="search-outline" size={52} color={theme.colors.primary} />
          )}
          <ActivityIndicator color={theme.colors.primary} />
          <Text variant="body" muted center>
            Searching the web for this piece…
          </Text>
        </View>
      )}

      {phase === 'result' && chosen && (
        <View style={{ gap: Spacing.three }}>
          <View style={{ alignItems: 'center' }}>
            <ItemTile imageUrl={image} color={chosen.colors?.[0]} category={chosen.category} size={150} radius={theme.radius.xl} />
          </View>

          <Card style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="caption" muted>
                Best match · {Math.round(chosen.confidence * 100)}% sure
              </Text>
              {!chosen.inStock ? (
                <Text variant="caption" color={theme.colors.danger}>
                  No longer sold
                </Text>
              ) : null}
            </View>
            <Text variant="heading">{chosen.name}</Text>
            <Text variant="body" muted>
              {chosen.brand}
              {chosen.price != null ? ` · $${chosen.price}` : ''}
              {chosen.source ? ` · ${chosen.source}` : ''}
            </Text>
          </Card>

          {result && result.alternatives.length ? (
            <View style={{ gap: 8 }}>
              <Text variant="label" muted>
                Not quite? Pick another match
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[result.best, ...result.alternatives].map((g, i) => (
                  <Chip key={i} label={g.name} selected={chosen.name === g.name} onPress={() => setChosen(g)} size="sm" />
                ))}
              </View>
            </View>
          ) : null}

          <Text variant="caption" muted>
            You can fix the name or where it&apos;s from on the next screen.
          </Text>
          <Button title="Looks right — add it" icon="checkmark" onPress={addToCloset} full size="lg" />
          <Button title="Scan again" icon="refresh" variant="ghost" onPress={() => setPhase('capture')} full />
        </View>
      )}
    </Screen>
  );
}
