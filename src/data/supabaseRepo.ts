import { supabase } from '@/lib/supabase';
import { DEFAULT_THEME } from '@/theme/themes';
import type { Board, BoardItem, ClothingItem, Outfit, OutfitItem, Profile } from '@/types/models';

import { DEMO_FEED } from './fixtures';
import { styleMatchScore, withItemDefaults, type Repository } from './repository';

// ─── Row ↔ model mappers ─────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

function rowToProfile(r: any): Profile {
  return {
    id: r.id,
    username: r.username,
    displayName: r.display_name ?? 'You',
    avatarUrl: r.avatar_url,
    bio: r.bio,
    theme: r.theme ?? DEFAULT_THEME,
    styleTypes: r.style_types ?? [],
    bodyProfile: r.body_profile ?? {},
    location: r.location ?? null,
    onboarded: r.onboarded ?? false,
  };
}

function profileToRow(p: Partial<Profile>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  const map: [keyof Profile, string][] = [
    ['username', 'username'],
    ['displayName', 'display_name'],
    ['avatarUrl', 'avatar_url'],
    ['bio', 'bio'],
    ['theme', 'theme'],
    ['styleTypes', 'style_types'],
    ['bodyProfile', 'body_profile'],
    ['location', 'location'],
    ['onboarded', 'onboarded'],
  ];
  for (const [key, col] of map) if (p[key] !== undefined) r[col] = p[key];
  return r;
}

function rowToItem(r: any): ClothingItem {
  return {
    id: r.id,
    userId: r.user_id,
    name: r.name,
    category: r.category,
    subcategory: r.subcategory,
    colors: r.colors ?? [],
    brand: r.brand,
    price: r.price != null ? Number(r.price) : null,
    currency: r.currency ?? 'USD',
    source: r.source,
    buyUrl: r.buy_url,
    inStock: r.in_stock ?? true,
    imageUrl: r.image_url,
    thumbUrl: r.thumb_url,
    warmth: r.warmth ?? 3,
    formality: r.formality ?? 3,
    seasons: r.seasons ?? [],
    occasions: r.occasions ?? [],
    styleTags: r.style_tags ?? [],
    isWishlist: r.is_wishlist ?? false,
    timesWorn: r.times_worn ?? 0,
    lastWorn: r.last_worn,
    createdAt: r.created_at,
  };
}

function itemToRow(i: Partial<ClothingItem>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  const map: [keyof ClothingItem, string][] = [
    ['name', 'name'],
    ['category', 'category'],
    ['subcategory', 'subcategory'],
    ['colors', 'colors'],
    ['brand', 'brand'],
    ['price', 'price'],
    ['currency', 'currency'],
    ['source', 'source'],
    ['buyUrl', 'buy_url'],
    ['inStock', 'in_stock'],
    ['imageUrl', 'image_url'],
    ['thumbUrl', 'thumb_url'],
    ['warmth', 'warmth'],
    ['formality', 'formality'],
    ['seasons', 'seasons'],
    ['occasions', 'occasions'],
    ['styleTags', 'style_tags'],
    ['isWishlist', 'is_wishlist'],
    ['timesWorn', 'times_worn'],
    ['lastWorn', 'last_worn'],
  ];
  for (const [key, col] of map) if (i[key] !== undefined) r[col] = i[key];
  return r;
}

function rowToOutfitItem(r: any): OutfitItem {
  return {
    id: r.id,
    outfitId: r.outfit_id,
    clothingItemId: r.clothing_item_id,
    isOwned: r.is_owned ?? true,
    slot: r.slot,
    layer: r.layer ?? 0,
    snapshot: r.item_snapshot ?? { name: 'Item' },
  };
}

function rowToOutfit(r: any): Outfit {
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title ?? 'Untitled outfit',
    occasion: r.occasion,
    weather: r.weather ?? null,
    background: r.background ?? 'white',
    coverUrl: r.cover_url,
    source: r.source ?? 'manual',
    notes: r.notes,
    isPublic: r.is_public ?? false,
    likesCount: r.likes_count ?? 0,
    createdAt: r.created_at,
    items: ((r.outfit_items as any[]) ?? []).map(rowToOutfitItem).sort((a, b) => a.layer - b.layer),
  };
}

function rowToBoard(r: any): Board {
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title ?? 'Untitled board',
    description: r.description,
    coverUrl: r.cover_url,
    isPublic: r.is_public ?? true,
    createdAt: r.created_at,
    items: ((r.board_items as any[]) ?? []).map(
      (b): BoardItem => ({
        id: b.id,
        boardId: b.board_id,
        kind: b.kind,
        outfitId: b.outfit_id,
        clothingItemId: b.clothing_item_id,
        imageUrl: b.image_url,
        sourceUrl: b.source_url,
        note: b.note,
        position: b.position ?? 0,
      }),
    ),
  };
}

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

/** Supabase-backed adapter scoped to the signed-in user. */
export function createSupabaseRepository(userId: string): Repository {
  return {
    async getProfile() {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) throw new Error(error.message);
      if (data) return rowToProfile(data);
      // Profile row should be created by a trigger; insert defensively if missing.
      const inserted = unwrap(
        await supabase.from('profiles').insert({ id: userId, display_name: 'You' }).select().single(),
      );
      return rowToProfile(inserted);
    },
    async updateProfile(patch) {
      const inserted = unwrap(
        await supabase.from('profiles').update(profileToRow(patch)).eq('id', userId).select().single(),
      );
      return rowToProfile(inserted);
    },

    async listItems() {
      const data = unwrap(
        await supabase.from('clothing_items').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      );
      return (data as any[]).map(rowToItem);
    },
    async createItem(input) {
      const row = { user_id: userId, ...itemToRow(withItemDefaults(input)) };
      return rowToItem(unwrap(await supabase.from('clothing_items').insert(row).select().single()));
    },
    async createItems(inputs) {
      if (!inputs.length) return [];
      const rows = inputs.map((i) => ({ user_id: userId, ...itemToRow(withItemDefaults(i)) }));
      const data = unwrap(await supabase.from('clothing_items').insert(rows).select());
      return (data as any[]).map(rowToItem);
    },
    async updateItem(id, patch) {
      return rowToItem(
        unwrap(await supabase.from('clothing_items').update(itemToRow(patch)).eq('id', id).select().single()),
      );
    },
    async deleteItem(id) {
      const { error } = await supabase.from('clothing_items').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },

    async listOutfits() {
      const data = unwrap(
        await supabase
          .from('outfits')
          .select('*, outfit_items(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      );
      return (data as any[]).map(rowToOutfit);
    },
    async createOutfit(input) {
      const outfit = unwrap(
        await supabase
          .from('outfits')
          .insert({
            user_id: userId,
            title: input.title,
            occasion: input.occasion ?? null,
            weather: input.weather ?? {},
            background: input.background ?? 'white',
            cover_url: input.coverUrl ?? null,
            source: input.source ?? 'manual',
            notes: input.notes ?? null,
            is_public: input.isPublic ?? false,
          })
          .select()
          .single(),
      ) as any;
      if (input.items.length) {
        const rows = input.items.map((it, i) => ({
          outfit_id: outfit.id,
          clothing_item_id: it.clothingItemId ?? null,
          is_owned: it.isOwned ?? true,
          slot: it.slot ?? null,
          layer: it.layer ?? i,
          item_snapshot: it.snapshot,
        }));
        const { error } = await supabase.from('outfit_items').insert(rows);
        if (error) throw new Error(error.message);
      }
      const full = unwrap(
        await supabase.from('outfits').select('*, outfit_items(*)').eq('id', outfit.id).single(),
      );
      return rowToOutfit(full);
    },
    async updateOutfit(id, patch) {
      const row: Record<string, unknown> = {};
      if (patch.title !== undefined) row.title = patch.title;
      if (patch.occasion !== undefined) row.occasion = patch.occasion;
      if (patch.background !== undefined) row.background = patch.background;
      if (patch.coverUrl !== undefined) row.cover_url = patch.coverUrl;
      if (patch.notes !== undefined) row.notes = patch.notes;
      if (patch.isPublic !== undefined) row.is_public = patch.isPublic;
      unwrap(await supabase.from('outfits').update(row).eq('id', id).select().single());
      const full = unwrap(await supabase.from('outfits').select('*, outfit_items(*)').eq('id', id).single());
      return rowToOutfit(full);
    },
    async deleteOutfit(id) {
      const { error } = await supabase.from('outfits').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },

    async listBoards() {
      const data = unwrap(
        await supabase
          .from('boards')
          .select('*, board_items(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      );
      return (data as any[]).map(rowToBoard);
    },
    async createBoard(input) {
      const board = unwrap(
        await supabase
          .from('boards')
          .insert({
            user_id: userId,
            title: input.title,
            description: input.description ?? null,
            is_public: input.isPublic ?? true,
          })
          .select('*, board_items(*)')
          .single(),
      );
      return rowToBoard(board);
    },
    async addBoardItem(boardId, item) {
      const { error } = await supabase.from('board_items').insert({
        board_id: boardId,
        kind: item.kind,
        outfit_id: item.outfitId ?? null,
        clothing_item_id: item.clothingItemId ?? null,
        image_url: item.imageUrl ?? null,
        source_url: item.sourceUrl ?? null,
        note: item.note ?? null,
        position: item.position ?? 0,
      });
      if (error) throw new Error(error.message);
      const board = unwrap(
        await supabase.from('boards').select('*, board_items(*)').eq('id', boardId).single(),
      );
      return rowToBoard(board);
    },

    async getFeed(viewerStyleTypes) {
      // Real cross-user feed lives in `outfits` (is_public). Until the community
      // has content, blend in the curated demo posts so the feed is never empty.
      return DEMO_FEED.map((post) => ({
        ...post,
        matchScore: styleMatchScore(post.author.styleTypes, viewerStyleTypes),
      })).sort((a, b) => b.matchScore - a.matchScore);
    },
  };
}
