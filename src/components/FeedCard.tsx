import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { categoryById, STYLE_TYPES } from '@/constants/catalog';
import { affiliateUrl } from '@/lib/affiliate';
import { useTheme } from '@/theme';
import type { FeedPost } from '@/types/models';

import { Avatar } from './Avatar';
import { ItemTile } from './ItemTile';
import { OutfitStage } from './OutfitStage';
import { Button, Card, Text } from './ui';

function styleLabels(ids: string[]): string {
  return ids.map((id) => STYLE_TYPES.find((s) => s.id === id)?.label ?? id).join(' · ');
}

interface Props {
  post: FeedPost;
  onSave?: (post: FeedPost) => Promise<void>;
}

export function FeedCard({ post, onSave }: Props) {
  const theme = useTheme();
  const c = theme.colors;
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.outfit.likesCount);
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleLike = () => {
    setLiked((l) => {
      setLikes((n) => (l ? n - 1 : n + 1));
      return !l;
    });
  };

  const save = async () => {
    if (saved || !onSave) return;
    setSaved(true);
    try {
      await onSave(post);
    } catch {
      setSaved(false);
    }
  };

  const buy = (url?: string | null) => {
    const a = affiliateUrl(url);
    if (a) WebBrowser.openBrowserAsync(a).catch(() => {});
  };

  const matchPct = Math.round(post.matchScore * 100);

  return (
    <Card padded={false} style={{ overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 }}>
        <Avatar name={post.author.displayName} url={post.author.avatarUrl} size={42} />
        <View style={{ flex: 1 }}>
          <Text variant="subtitle">{post.author.displayName}</Text>
          <Text variant="caption" muted numberOfLines={1}>
            @{post.author.username} · {styleLabels(post.author.styleTypes)}
          </Text>
        </View>
        <View style={{ backgroundColor: c.bgInset, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
          <Text variant="caption" color={c.primary}>
            {matchPct}% match
          </Text>
        </View>
      </View>

      <OutfitStage
        items={post.outfit.items.map((i) => i.snapshot)}
        background={post.outfit.background}
        figure
        height={260}
        tile={72}
        style={{ borderRadius: 0 }}
      />

      <View style={{ padding: 14, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
          <Pressable onPress={toggleLike} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} hitSlop={6}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? c.like : c.text} />
            <Text variant="label">{likes}</Text>
          </Pressable>
          <Pressable onPress={save} hitSlop={6}>
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? c.primary : c.text} />
          </Pressable>
          <View style={{ flex: 1 }} />
          <Pressable onPress={() => setOpen((o) => !o)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} hitSlop={6}>
            <Text variant="label" color={c.primary}>
              Shop the look
            </Text>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={c.primary} />
          </Pressable>
        </View>

        <Text variant="subtitle">{post.outfit.title}</Text>

        {open ? (
          <View style={{ gap: 10, marginTop: 4 }}>
            {post.outfit.items.map((it, idx) => {
              const s = it.snapshot;
              return (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <ItemTile
                    imageUrl={s.imageUrl}
                    color={s.colors?.[0]}
                    emoji={categoryById(s.category ?? 'other').emoji}
                    size={46}
                  />
                  <View style={{ flex: 1 }}>
                    <Text variant="label" numberOfLines={1}>
                      {s.name}
                    </Text>
                    <Text variant="caption" muted numberOfLines={1}>
                      {s.brand ?? s.source}
                      {s.price != null ? ` · $${s.price}` : ''}
                    </Text>
                  </View>
                  {s.inStock === false ? (
                    <Text variant="caption" muted>
                      Sold out
                    </Text>
                  ) : (
                    <Button title="Buy" icon="open-outline" iconRight size="sm" variant="outline" onPress={() => buy(s.buyUrl)} />
                  )}
                </View>
              );
            })}
            <Text variant="caption" muted style={{ marginTop: 2 }}>
              Links are affiliate-tagged · prices may vary
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}
