import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { Button, Card, IconButton, Input, Screen, Text } from '@/components/ui';
import { useData } from '@/data/DataProvider';
import { useFocusQuery } from '@/hooks/useFocusQuery';
import { Spacing, useTheme } from '@/theme';
import type { Board, BoardItem } from '@/types/models';

function BoardItemTile({ item, size = 72 }: { item: BoardItem; size?: number }) {
  const theme = useTheme();
  if (item.imageUrl) {
    return (
      <Image source={{ uri: item.imageUrl }} style={{ width: size, height: size, borderRadius: theme.radius.md }} contentFit="cover" />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.bgInset,
        padding: 6,
        justifyContent: 'flex-end',
      }}>
      <Ionicons name="bookmark" size={16} color={theme.colors.textMuted} />
      <Text variant="caption" muted numberOfLines={2} style={{ fontSize: 10, marginTop: 4 }}>
        {item.note ?? 'Pin'}
      </Text>
    </View>
  );
}

function BoardCard({ board }: { board: Board }) {
  const theme = useTheme();
  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text variant="subtitle">{board.title}</Text>
          <Text variant="caption" muted>
            {board.items.length} {board.items.length === 1 ? 'pin' : 'pins'}
            {board.isPublic ? ' · public' : ' · private'}
          </Text>
        </View>
      </View>
      {board.items.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {board.items.map((it) => (
            <BoardItemTile key={it.id} item={it} />
          ))}
        </ScrollView>
      ) : (
        <Text variant="caption" muted>
          Empty board — save looks from the feed or your outfits.
        </Text>
      )}
    </Card>
  );
}

export default function Boards() {
  const theme = useTheme();
  const { repo } = useData();
  const { data: boards, loading, reload } = useFocusQuery(() => repo.listBoards(), [repo]);

  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState('');

  const createBoard = async () => {
    const name = title.trim() || 'New board';
    await repo.createBoard({ title: name });
    setTitle('');
    setComposing(false);
    reload();
  };

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.three }}>
        <View>
          <Text variant="title">Boards</Text>
          <Text variant="body" muted>
            Collect outfits & inspo, Pinterest-style.
          </Text>
        </View>
        <IconButton icon={composing ? 'close' : 'add'} variant="solid" onPress={() => setComposing((v) => !v)} />
      </View>

      {composing ? (
        <Card style={{ gap: 10, marginBottom: Spacing.three }}>
          <Input label="Board name" placeholder="e.g. Spring fits" value={title} onChangeText={setTitle} autoFocus />
          <Button title="Create board" icon="add" onPress={createBoard} full />
        </Card>
      ) : null}

      {loading && !boards ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (boards?.length ?? 0) === 0 ? (
        <EmptyState icon="albums-outline" title="No boards yet" subtitle="Make a board for your moods, seasons or trips.">
          <Button title="Create your first board" icon="add" onPress={() => setComposing(true)} full />
        </EmptyState>
      ) : (
        <View style={{ gap: Spacing.three }}>
          {boards!.map((b) => (
            <BoardCard key={b.id} board={b} />
          ))}
        </View>
      )}
    </Screen>
  );
}
