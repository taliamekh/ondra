import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/components/Brand';
import { ThemePicker } from '@/components/ThemePicker';
import { Button, Chip, IconButton, Input, Text } from '@/components/ui';
import { STYLE_TYPES, type StyleId } from '@/constants/catalog';
import { useData } from '@/data/DataProvider';
import { STARTER_CLOSET } from '@/data/fixtures';
import { Spacing, useTheme, useThemeControl } from '@/theme';

const STEPS = ['welcome', 'theme', 'styles', 'name'] as const;

export default function Onboarding() {
  const theme = useTheme();
  const router = useRouter();
  const { repo, updateProfile } = useData();
  const { themeKey, setThemeKey } = useThemeControl();

  const [step, setStep] = useState(0);
  const [styles, setStyles] = useState<Set<StyleId>>(new Set());
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleStyle = (id: StyleId) => {
    setStyles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canContinue = step !== 2 || styles.size > 0;

  const finish = async () => {
    setSaving(true);
    try {
      await updateProfile({
        displayName: name.trim() || 'You',
        theme: themeKey,
        styleTypes: [...styles],
        onboarded: true,
      });
      // Seed a starter closet so the wardrobe + generator feel alive immediately.
      const existing = await repo.listItems();
      if (existing.length === 0) await repo.createItems(STARTER_CLOSET);
      router.replace('/closet');
    } catch {
      setSaving(false);
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else finish();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* Header: back + progress dots */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.three, height: 48, gap: 8 }}>
          {step > 0 ? (
            <IconButton icon="chevron-back" onPress={() => setStep((s) => s - 1)} size={22} />
          ) : (
            <View style={{ width: 40 }} />
          )}
          <View style={{ flexDirection: 'row', gap: 6, flex: 1, justifyContent: 'center' }}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === step ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === step ? theme.colors.primary : theme.colors.bgInset,
                }}
              />
            ))}
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: Spacing.four, gap: Spacing.four, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          {step === 0 && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
              <Text style={{ fontSize: 64 }}>👗✨</Text>
              <Brand size={56} />
              <Text variant="title" center>
                Your closet, styled.
              </Text>
              <Text variant="body" muted center style={{ maxWidth: 320 }}>
                Track what you own, get outfit ideas for the weather and the occasion, and share your
                looks. Let&apos;s set up your style in a few taps.
              </Text>
            </View>
          )}

          {step === 1 && (
            <View style={{ gap: Spacing.three }}>
              <Text variant="title">Pick your vibe ✨</Text>
              <Text variant="body" muted>
                This themes the whole app. Tap to preview — you can change it anytime.
              </Text>
              <ThemePicker value={themeKey} onSelect={setThemeKey} />
            </View>
          )}

          {step === 2 && (
            <View style={{ gap: Spacing.three }}>
              <Text variant="title">What&apos;s your style?</Text>
              <Text variant="body" muted>
                Choose a few. We&apos;ll tailor your outfit suggestions and your feed around them.
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {STYLE_TYPES.map((s) => (
                  <Chip
                    key={s.id}
                    label={s.label}
                    emoji={s.emoji}
                    selected={styles.has(s.id)}
                    onPress={() => toggleStyle(s.id)}
                  />
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={{ gap: Spacing.three }}>
              <Text variant="title">What should we call you?</Text>
              <Text variant="body" muted>
                This shows on your profile and the looks you share.
              </Text>
              <Input
                label="Name"
                placeholder="e.g. Talia"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="done"
              />
              <View
                style={{
                  marginTop: 8,
                  padding: Spacing.three,
                  borderRadius: theme.radius.lg,
                  backgroundColor: theme.colors.bgInset,
                  gap: 6,
                }}>
                <Text variant="label">{styles.size} styles selected</Text>
                <Text variant="caption" muted>
                  We&apos;ll seed your closet with a few starter pieces so you can try outfit ideas right
                  away.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={{ padding: Spacing.three, gap: 8 }}>
          <Button
            title={step === STEPS.length - 1 ? 'Enter Onda' : step === 0 ? 'Get started' : 'Continue'}
            icon={step === STEPS.length - 1 ? 'sparkles' : undefined}
            onPress={next}
            disabled={!canContinue}
            loading={saving}
            full
            size="lg"
          />
          {step === 2 ? (
            <Text variant="caption" muted center>
              {styles.size === 0 ? 'Pick at least one to continue' : 'Nice picks 💫'}
            </Text>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}
