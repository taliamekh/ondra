import { ActivityIndicator, View } from 'react-native';

import { FeedCard } from '@/components/FeedCard';
import { Screen, Text } from '@/components/ui';
import { useData } from '@/data/DataProvider';
import { useFocusQuery } from '@/hooks/useFocusQuery';
import { Spacing, useTheme } from '@/theme';
import type { FeedPost } from '@/types/models';

export default function Feed() {
  const theme = useTheme();
  const { repo, profile } = useData();
  const { data: posts, loading } = useFocusQuery(
    () => repo.getFeed(profile?.styleTypes ?? []),
    [repo, profile?.styleTypes],
  );

  const saveToBoard = async (post: FeedPost) => {
    const boards = await repo.listBoards();
    let board = boards.find((b) => b.title === 'Inspo');
    if (!board) board = await repo.createBoard({ title: 'Inspo', description: 'Saved from the feed' });
    await repo.addBoardItem(board.id, {
      kind: 'image',
      outfitId: null,
      clothingItemId: null,
      imageUrl: null,
      sourceUrl: post.outfit.items[0]?.snapshot.buyUrl ?? null,
      note: `${post.author.displayName} · ${post.outfit.title}`,
      position: 0,
    });
  };

  return (
    <Screen scroll>
      <View style={{ marginBottom: Spacing.three }}>
        <Text variant="title">Feed</Text>
        <Text variant="body" muted>
          Looks from people who dress like you.
        </Text>
      </View>

      {loading && !posts ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <View style={{ gap: Spacing.three }}>
          {(posts ?? []).map((p) => (
            <FeedCard key={p.id} post={p} onSave={saveToBoard} />
          ))}
        </View>
      )}
    </Screen>
  );
}
