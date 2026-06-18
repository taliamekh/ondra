import type { BackgroundId, CategoryId, OccasionId, SeasonId, StyleId } from '@/constants/catalog';
import type { ThemeKey } from '@/theme/themes';

export type DataMode = 'cloud' | 'local';

export interface GeoLocation {
  lat?: number;
  lon?: number;
  city?: string;
}

export interface BodyProfile {
  heightCm?: number;
  build?: 'petite' | 'slim' | 'average' | 'athletic' | 'curvy' | 'plus';
  skinTone?: string;
  hair?: string;
}

export interface Profile {
  id: string;
  username?: string | null;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  theme: ThemeKey;
  styleTypes: StyleId[];
  bodyProfile: BodyProfile;
  location?: GeoLocation | null;
  onboarded: boolean;
}

export interface ClothingItem {
  id: string;
  userId: string;
  name: string;
  category: CategoryId;
  subcategory?: string | null;
  colors: string[];
  brand?: string | null;
  price?: number | null;
  currency: string;
  source?: string | null;
  buyUrl?: string | null;
  /** false = item is no longer sold at the original source. */
  inStock: boolean;
  imageUrl?: string | null;
  thumbUrl?: string | null;
  /** 1 (light / breathable) .. 5 (heavy / warm). Drives weather matching. */
  warmth: number;
  /** 1 (loungewear) .. 5 (black-tie). Drives occasion matching. */
  formality: number;
  seasons: SeasonId[];
  occasions: OccasionId[];
  styleTags: StyleId[];
  /** true = a wishlist / "want to buy" item rather than something owned. */
  isWishlist: boolean;
  timesWorn: number;
  lastWorn?: string | null;
  createdAt: string;
}

/** A public, privacy-safe copy of an item's display info, stored on each outfit. */
export interface ItemSnapshot {
  name: string;
  brand?: string | null;
  imageUrl?: string | null;
  thumbUrl?: string | null;
  price?: number | null;
  currency?: string;
  source?: string | null;
  buyUrl?: string | null;
  inStock?: boolean;
  category?: CategoryId;
  colors?: string[];
}

export interface OutfitItem {
  id: string;
  outfitId: string;
  /** Links back to the owner's private closet item (null for recommended items). */
  clothingItemId?: string | null;
  /** true = from the user's closet, false = a recommended / shoppable extra. */
  isOwned: boolean;
  slot?: string | null;
  layer: number;
  snapshot: ItemSnapshot;
}

export interface WeatherSnapshot {
  tempC: number;
  feelsLikeC?: number;
  condition: string;
  code?: number;
  high?: number;
  low?: number;
  city?: string;
}

export type OutfitSource = 'generated' | 'manual' | 'selfie' | 'imported';

export interface Outfit {
  id: string;
  userId: string;
  title: string;
  occasion?: OccasionId | null;
  weather?: WeatherSnapshot | null;
  background: BackgroundId;
  coverUrl?: string | null;
  source: OutfitSource;
  notes?: string | null;
  isPublic: boolean;
  likesCount: number;
  createdAt: string;
  items: OutfitItem[];
}

export type BoardItemKind = 'outfit' | 'clothing_item' | 'image';

export interface BoardItem {
  id: string;
  boardId: string;
  kind: BoardItemKind;
  outfitId?: string | null;
  clothingItemId?: string | null;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  note?: string | null;
  position: number;
}

export interface Board {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  isPublic: boolean;
  createdAt: string;
  items: BoardItem[];
}

/** A post in the social feed: someone else's public outfit + its author. */
export interface FeedPost {
  id: string;
  author: Pick<Profile, 'id' | 'displayName' | 'username' | 'avatarUrl' | 'styleTypes'>;
  outfit: Outfit;
  likedByMe: boolean;
  /** 0..1 — how well this post matches the viewer's style. */
  matchScore: number;
}
