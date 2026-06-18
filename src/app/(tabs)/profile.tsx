import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { SectionHeader } from '@/components/SectionHeader';
import { ThemePicker } from '@/components/ThemePicker';
import { Button, Card, Chip, Screen, Text } from '@/components/ui';
import { STYLE_TYPES, type StyleId } from '@/constants/catalog';
import { useData } from '@/data/DataProvider';
import { useFocusQuery } from '@/hooks/useFocusQuery';
import { Spacing, useTheme, useThemeControl } from '@/theme';

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text variant="title">{value}</Text>
      <Text variant="caption" muted>
        {label}
      </Text>
    </View>
  );
}

export default function Profile() {
  const theme = useTheme();
  const { profile, mode, updateProfile, resetAccount, repo } = useData();
  const { themeKey, setThemeKey } = useThemeControl();

  const [styles, setStyles] = useState<Set<StyleId>>(new Set(profile?.styleTypes ?? []));

  const stats = useFocusQuery(async () => {
    const [items, outfits, boards] = await Promise.all([repo.listItems(), repo.listOutfits(), repo.listBoards()]);
    return { items: items.length, outfits: outfits.length, boards: boards.length };
  }, [repo]);

  const toggleStyle = (id: StyleId) => {
    const next = new Set(styles);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setStyles(next);
    updateProfile({ styleTypes: [...next] });
  };

  const pickTheme = (key: typeof themeKey) => {
    setThemeKey(key);
    updateProfile({ theme: key });
  };

  return (
    <Screen scroll>
      {/* Identity */}
      <View style={{ alignItems: 'center', gap: 8, marginBottom: Spacing.four }}>
        <Avatar name={profile?.displayName ?? 'You'} url={profile?.avatarUrl} size={84} />
        <Text variant="title">{profile?.displayName ?? 'You'}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: theme.colors.bgInset,
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 999,
          }}>
          <Ionicons
            name={mode === 'cloud' ? 'cloud-done-outline' : 'phone-portrait-outline'}
            size={14}
            color={theme.colors.textMuted}
          />
          <Text variant="caption" muted>
            {mode === 'cloud' ? 'Synced to cloud' : 'Saved on this device'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <Card style={{ flexDirection: 'row', marginBottom: Spacing.four }}>
        <StatBlock value={stats.data?.items ?? 0} label="Items" />
        <StatBlock value={stats.data?.outfits ?? 0} label="Outfits" />
        <StatBlock value={stats.data?.boards ?? 0} label="Boards" />
      </Card>

      {/* Styles */}
      <SectionHeader title="Your style" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.four }}>
        {STYLE_TYPES.map((s) => (
          <Chip key={s.id} label={s.label} selected={styles.has(s.id)} onPress={() => toggleStyle(s.id)} size="sm" />
        ))}
      </View>

      {/* Theme */}
      <SectionHeader title="Theme" />
      <View style={{ marginBottom: Spacing.four }}>
        <ThemePicker value={themeKey} onSelect={pickTheme} />
      </View>

      {/* Account */}
      <SectionHeader title="Account" />
      <Card style={{ gap: 12 }}>
        <Text variant="body" muted>
          {mode === 'cloud'
            ? 'Your closet, outfits and boards are synced to Supabase and protected by row-level security.'
            : 'Running in offline mode. Enable anonymous sign-ins on your Supabase project to sync across devices.'}
        </Text>
        <Button title="Start over" icon="refresh" variant="secondary" onPress={resetAccount} full />
      </Card>

      <Text variant="caption" muted center style={{ marginTop: Spacing.four }}>
        onda · your closet, styled
      </Text>
    </Screen>
  );
}
