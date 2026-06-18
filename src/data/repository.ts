import type { CategoryId, OccasionId } from '@/constants/catalog';
import type {
  Board,
  BoardItem,
  ClothingItem,
  FeedPost,
  ItemSnapshot,
  Outfit,
  Profile,
} from '@/types/models';

export type NewClothingItem = Partial<Omit<ClothingItem, 'id' | 'userId' | 'createdAt'>> & {
  name: string;
  category: CategoryId;
};

export interface NewOutfitItem {
  clothingItemId?: string | null;
  isOwned?: boolean;
  slot?: string | null;
  layer?: number;
  snapshot: ItemSnapshot;
}

export interface NewOutfit {
  title: string;
  occasion?: OccasionId | null;
  weather?: Outfit['weather'];
  background?: Outfit['background'];
  source?: Outfit['source'];
  notes?: string | null;
  isPublic?: boolean;
  coverUrl?: string | null;
  items: NewOutfitItem[];
}

export interface NewBoard {
  title: string;
  description?: string | null;
  isPublic?: boolean;
}

/**
 * The data contract every storage backend implements. Screens depend only on
 * this interface, so swapping between the cloud (Supabase) and local fallback
 * adapters is invisible to the UI.
 */
export interface Repository {
  getProfile(): Promise<Profile>;
  updateProfile(patch: Partial<Profile>): Promise<Profile>;

  listItems(): Promise<ClothingItem[]>;
  createItem(input: NewClothingItem): Promise<ClothingItem>;
  createItems(inputs: NewClothingItem[]): Promise<ClothingItem[]>;
  updateItem(id: string, patch: Partial<ClothingItem>): Promise<ClothingItem>;
  deleteItem(id: string): Promise<void>;

  listOutfits(): Promise<Outfit[]>;
  createOutfit(input: NewOutfit): Promise<Outfit>;
  updateOutfit(id: string, patch: Partial<Outfit>): Promise<Outfit>;
  deleteOutfit(id: string): Promise<void>;

  listBoards(): Promise<Board[]>;
  createBoard(input: NewBoard): Promise<Board>;
  addBoardItem(boardId: string, item: Omit<BoardItem, 'id' | 'boardId'>): Promise<Board>;

  getFeed(viewerStyleTypes: string[]): Promise<FeedPost[]>;
}

/** Sensible defaults applied to a partially-specified new clothing item. */
export function withItemDefaults(input: NewClothingItem): Omit<ClothingItem, 'id' | 'userId' | 'createdAt'> {
  return {
    name: input.name,
    category: input.category,
    subcategory: input.subcategory ?? null,
    colors: input.colors ?? [],
    brand: input.brand ?? null,
    price: input.price ?? null,
    currency: input.currency ?? 'USD',
    source: input.source ?? null,
    buyUrl: input.buyUrl ?? null,
    inStock: input.inStock ?? true,
    imageUrl: input.imageUrl ?? null,
    thumbUrl: input.thumbUrl ?? null,
    warmth: input.warmth ?? 3,
    formality: input.formality ?? 3,
    seasons: input.seasons ?? [],
    occasions: input.occasions ?? [],
    styleTags: input.styleTags ?? [],
    isWishlist: input.isWishlist ?? false,
    timesWorn: input.timesWorn ?? 0,
    lastWorn: input.lastWorn ?? null,
  };
}

/** 0..1 similarity between an author's styles and the viewer's styles. */
export function styleMatchScore(authorStyles: string[], viewerStyles: string[]): number {
  if (!viewerStyles.length || !authorStyles.length) return 0.45;
  const set = new Set(viewerStyles);
  const overlap = authorStyles.filter((s) => set.has(s)).length;
  return Math.min(1, 0.3 + overlap / Math.max(authorStyles.length, viewerStyles.length));
}
