import AsyncStorage from '@react-native-async-storage/async-storage';

import { newId } from '@/lib/id';
import { DEFAULT_THEME } from '@/theme/themes';
import type { Board, BoardItem, ClothingItem, FeedPost, Outfit, OutfitItem, Profile } from '@/types/models';

import { DEMO_FEED } from './fixtures';
import {
  styleMatchScore,
  withItemDefaults,
  type NewBoard,
  type NewClothingItem,
  type NewOutfit,
  type Repository,
} from './repository';

const LOCAL_USER = 'local-user';
const K = {
  profile: 'onda.local.profile',
  items: 'onda.local.items',
  outfits: 'onda.local.outfits',
  boards: 'onda.local.boards',
};

const DEFAULT_PROFILE: Profile = {
  id: LOCAL_USER,
  username: null,
  displayName: 'You',
  avatarUrl: null,
  bio: null,
  theme: DEFAULT_THEME,
  styleTypes: [],
  bodyProfile: {},
  location: null,
  onboarded: false,
};

async function read<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}
async function write(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

function makeItem(input: NewClothingItem): ClothingItem {
  return {
    id: newId('it_'),
    userId: LOCAL_USER,
    createdAt: new Date().toISOString(),
    ...withItemDefaults(input),
  };
}

function makeOutfit(input: NewOutfit): Outfit {
  const id = newId('of_');
  const items: OutfitItem[] = input.items.map((it, i) => ({
    id: newId('oi_'),
    outfitId: id,
    clothingItemId: it.clothingItemId ?? null,
    isOwned: it.isOwned ?? true,
    slot: it.slot ?? null,
    layer: it.layer ?? i,
    snapshot: it.snapshot,
  }));
  return {
    id,
    userId: LOCAL_USER,
    title: input.title,
    occasion: input.occasion ?? null,
    weather: input.weather ?? null,
    background: input.background ?? 'white',
    coverUrl: input.coverUrl ?? null,
    source: input.source ?? 'manual',
    notes: input.notes ?? null,
    isPublic: input.isPublic ?? false,
    likesCount: 0,
    createdAt: new Date().toISOString(),
    items,
  };
}

/** AsyncStorage-backed offline adapter. Used when Supabase auth is unavailable. */
export function createLocalRepository(): Repository {
  return {
    async getProfile() {
      return read<Profile>(K.profile, DEFAULT_PROFILE);
    },
    async updateProfile(patch) {
      const current = await read<Profile>(K.profile, DEFAULT_PROFILE);
      const next = { ...current, ...patch };
      await write(K.profile, next);
      return next;
    },

    async listItems() {
      const items = await read<ClothingItem[]>(K.items, []);
      return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async createItem(input) {
      const item = makeItem(input);
      const items = await read<ClothingItem[]>(K.items, []);
      await write(K.items, [item, ...items]);
      return item;
    },
    async createItems(inputs) {
      const created = inputs.map(makeItem);
      const items = await read<ClothingItem[]>(K.items, []);
      await write(K.items, [...created, ...items]);
      return created;
    },
    async updateItem(id, patch) {
      const items = await read<ClothingItem[]>(K.items, []);
      const idx = items.findIndex((i) => i.id === id);
      if (idx < 0) throw new Error('Item not found');
      items[idx] = { ...items[idx], ...patch };
      await write(K.items, items);
      return items[idx];
    },
    async deleteItem(id) {
      const items = await read<ClothingItem[]>(K.items, []);
      await write(
        K.items,
        items.filter((i) => i.id !== id),
      );
    },

    async listOutfits() {
      const outfits = await read<Outfit[]>(K.outfits, []);
      return [...outfits].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async createOutfit(input) {
      const outfit = makeOutfit(input);
      const outfits = await read<Outfit[]>(K.outfits, []);
      await write(K.outfits, [outfit, ...outfits]);
      return outfit;
    },
    async updateOutfit(id, patch) {
      const outfits = await read<Outfit[]>(K.outfits, []);
      const idx = outfits.findIndex((o) => o.id === id);
      if (idx < 0) throw new Error('Outfit not found');
      outfits[idx] = { ...outfits[idx], ...patch };
      await write(K.outfits, outfits);
      return outfits[idx];
    },
    async deleteOutfit(id) {
      const outfits = await read<Outfit[]>(K.outfits, []);
      await write(
        K.outfits,
        outfits.filter((o) => o.id !== id),
      );
    },

    async listBoards() {
      const boards = await read<Board[]>(K.boards, []);
      return [...boards].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async createBoard(input: NewBoard) {
      const board: Board = {
        id: newId('bd_'),
        userId: LOCAL_USER,
        title: input.title,
        description: input.description ?? null,
        coverUrl: null,
        isPublic: input.isPublic ?? true,
        createdAt: new Date().toISOString(),
        items: [],
      };
      const boards = await read<Board[]>(K.boards, []);
      await write(K.boards, [board, ...boards]);
      return board;
    },
    async addBoardItem(boardId, item) {
      const boards = await read<Board[]>(K.boards, []);
      const idx = boards.findIndex((b) => b.id === boardId);
      if (idx < 0) throw new Error('Board not found');
      const boardItem: BoardItem = { id: newId('bi_'), boardId, ...item };
      boards[idx] = { ...boards[idx], items: [...boards[idx].items, boardItem] };
      if (!boards[idx].coverUrl && item.imageUrl) boards[idx].coverUrl = item.imageUrl;
      await write(K.boards, boards);
      return boards[idx];
    },

    async getFeed(viewerStyleTypes) {
      return DEMO_FEED.map((post) => ({
        ...post,
        matchScore: styleMatchScore(post.author.styleTypes, viewerStyleTypes),
      })).sort((a, b) => b.matchScore - a.matchScore);
    },
  };
}
