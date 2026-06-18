import type { CategoryId, OccasionId, SeasonId, StyleId } from '@/constants/catalog';
import { newId } from '@/lib/id';
import type { FeedPost, ItemSnapshot, Outfit, OutfitItem } from '@/types/models';

import type { NewClothingItem } from './repository';
// Real products resolved once from Shopify stores via the import-product Edge
// Function (name, photo URL, buy link). Regenerate with the script in the PR
// notes if products go stale. Order matches STARTER_META below.
import STARTER_PRODUCTS from './starterProducts.json';

/**
 * Wardrobe metadata for the starter closet (category, warmth, formality, etc.),
 * paired by index with the real product photo + buy link in starterProducts.json.
 * Edit these to change what new users start with.
 */
const STARTER_META: {
  name: string;
  brand: string;
  category: CategoryId;
  colors: string[];
  price: number;
  warmth: number;
  formality: number;
  seasons: SeasonId[];
  occasions: OccasionId[];
  styleTags: StyleId[];
}[] = [
  { name: 'Organic cotton crew tee', brand: 'Everlane', category: 'top', colors: ['#F5F5F5'], price: 30, warmth: 2, formality: 2, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['casual', 'school', 'work'], styleTags: ['minimalist', 'casual'] },
  { name: 'Cashmere crew sweater', brand: 'Everlane', category: 'top', colors: ['#2A2A2A'], price: 130, warmth: 4, formality: 3, seasons: ['fall', 'winter'], occasions: ['work', 'casual', 'date'], styleTags: ['minimalist', 'old_money'] },
  { name: 'Classic oxford shirt', brand: 'Everlane', category: 'top', colors: ['#A9C3E0'], price: 80, warmth: 2, formality: 3, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['work', 'school', 'brunch'], styleTags: ['preppy', 'old_money'] },
  { name: 'Way-High jeans', brand: 'Everlane', category: 'bottom', colors: ['#39507A'], price: 98, warmth: 3, formality: 2, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['casual', 'school', 'date', 'brunch'], styleTags: ['casual', 'vintage'] },
  { name: 'Wide-leg dream pant', brand: 'Everlane', category: 'bottom', colors: ['#1A1A1A'], price: 98, warmth: 3, formality: 3, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['work', 'casual', 'travel', 'lounge'], styleTags: ['minimalist'] },
  { name: 'Organic cotton waisted dress', brand: 'Everlane', category: 'dress', colors: ['#161616'], price: 90, warmth: 2, formality: 3, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['date', 'brunch', 'casual', 'party'], styleTags: ['minimalist', 'glam'] },
  { name: 'Cocoon alpaca crew', brand: 'Everlane', category: 'outerwear', colors: ['#D8C3A5'], price: 150, warmth: 5, formality: 3, seasons: ['fall', 'winter'], occasions: ['casual', 'work', 'date'], styleTags: ['minimalist', 'cottagecore'] },
  { name: 'Wool runners', brand: 'Allbirds', category: 'shoes', colors: ['#F2F2F2'], price: 98, warmth: 2, formality: 2, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['casual', 'school', 'travel', 'gym'], styleTags: ['casual', 'athleisure', 'minimalist'] },
  { name: 'Modern leather loafer', brand: 'Everlane', category: 'shoes', colors: ['#1C1C1C'], price: 168, warmth: 3, formality: 4, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['work', 'date', 'formal', 'brunch'], styleTags: ['old_money', 'minimalist'] },
  { name: 'Luxe leather tote', brand: 'Everlane', category: 'bag', colors: ['#1A1A1A'], price: 200, warmth: 3, formality: 3, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['work', 'school', 'travel'], styleTags: ['old_money', 'minimalist'] },
  { name: 'Compressive leggings', brand: 'Girlfriend Collective', category: 'bottom', colors: ['#1A1A1A'], price: 108, warmth: 2, formality: 1, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['gym', 'climbing', 'lounge', 'casual'], styleTags: ['athleisure'] },
  { name: 'Paloma sports bra', brand: 'Girlfriend Collective', category: 'activewear', colors: ['#1A1A1A'], price: 68, warmth: 1, formality: 1, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['gym', 'climbing'], styleTags: ['athleisure'] },
];

interface RawProduct {
  name: string | null;
  image: string | null;
  url: string | null;
  source: string | null;
  price: number | null;
  inStock: boolean;
  category: string;
}

/**
 * A starter wardrobe of REAL products (Everlane / Allbirds / Girlfriend
 * Collective) seeded for brand-new users — each with its real product photo and
 * a working buy link. Users can edit or delete any of these.
 */
export const STARTER_CLOSET: NewClothingItem[] = STARTER_META.map((m, i) => {
  const p = (STARTER_PRODUCTS as RawProduct[])[i] ?? ({} as RawProduct);
  return {
    name: m.name,
    category: m.category,
    colors: m.colors,
    brand: m.brand,
    price: p.price ?? m.price,
    currency: 'USD',
    source: p.source ?? m.brand,
    buyUrl: p.url ?? null,
    inStock: p.inStock ?? true,
    imageUrl: p.image ? p.image.replace('http://', 'https://') : null,
    warmth: m.warmth,
    formality: m.formality,
    seasons: m.seasons,
    occasions: m.occasions,
    styleTags: m.styleTags,
  };
});

// ─── Demo social feed ────────────────────────────────────────────────────────

interface DemoPostInput {
  username: string;
  displayName: string;
  styleTypes: string[];
  title: string;
  occasion: Outfit['occasion'];
  background: Outfit['background'];
  likes: number;
  createdAt: string;
  items: ItemSnapshot[];
}

function buildPost(input: DemoPostInput): FeedPost {
  const userId = newId('u_');
  const outfitId = newId('of_');
  const items: OutfitItem[] = input.items.map((snapshot, i) => ({
    id: newId('oi_'),
    outfitId,
    clothingItemId: null,
    isOwned: false,
    slot: snapshot.category ?? null,
    layer: i,
    snapshot,
  }));
  const outfit: Outfit = {
    id: outfitId,
    userId,
    title: input.title,
    occasion: input.occasion,
    weather: null,
    background: input.background,
    coverUrl: null,
    source: 'manual',
    notes: null,
    isPublic: true,
    likesCount: input.likes,
    createdAt: input.createdAt,
    items,
  };
  return {
    id: newId('fp_'),
    author: {
      id: userId,
      displayName: input.displayName,
      username: input.username,
      avatarUrl: null,
      styleTypes: input.styleTypes as FeedPost['author']['styleTypes'],
    },
    outfit,
    likedByMe: false,
    matchScore: 0.5,
  };
}

export const DEMO_FEED: FeedPost[] = [
  buildPost({
    username: 'mara.knits',
    displayName: 'Mara',
    styleTypes: ['cottagecore', 'boho'],
    title: 'Sunday market stroll',
    occasion: 'brunch',
    background: 'garden',
    likes: 248,
    createdAt: '2026-06-15T09:30:00Z',
    items: [
      { name: 'Linen blouse', brand: '& Other Stories', price: 89, currency: 'USD', source: '& Other Stories', buyUrl: 'https://www.stories.com', colors: ['#EDE3D2'], category: 'top' },
      { name: 'Tiered midi skirt', brand: 'Reformation', price: 148, currency: 'USD', source: 'Reformation', buyUrl: 'https://www.thereformation.com', colors: ['#C98AA6'], category: 'bottom' },
      { name: 'Woven flats', brand: 'Sézane', price: 135, currency: 'USD', source: 'Sézane', buyUrl: 'https://www.sezane.com', colors: ['#B98E5E'], category: 'shoes' },
      { name: 'Straw tote', brand: 'Madewell', price: 68, currency: 'USD', source: 'Madewell', buyUrl: 'https://www.madewell.com', colors: ['#D9B679'], category: 'bag' },
    ],
  }),
  buildPost({
    username: 'cyrus.fits',
    displayName: 'Cyrus',
    styleTypes: ['streetwear', 'techwear'],
    title: 'Concrete days',
    occasion: 'casual',
    background: 'studio_black',
    likes: 512,
    createdAt: '2026-06-14T18:05:00Z',
    items: [
      { name: 'Boxy tee', brand: 'COS', price: 45, currency: 'USD', source: 'COS', buyUrl: 'https://www.cos.com', colors: ['#2E2E32'], category: 'top' },
      { name: 'Tech cargos', brand: 'Carhartt WIP', price: 128, currency: 'USD', source: 'Carhartt', buyUrl: 'https://www.carhartt-wip.com', colors: ['#6E6B5E'], category: 'bottom' },
      { name: 'Chunky sneakers', brand: 'Salomon', price: 160, currency: 'USD', source: 'Salomon', buyUrl: 'https://www.salomon.com', colors: ['#3A3A3A'], category: 'shoes' },
      { name: 'Sling bag', brand: "Arc'teryx", price: 80, currency: 'USD', source: "Arc'teryx", buyUrl: 'https://arcteryx.com', colors: ['#1C1C1C'], category: 'bag' },
    ],
  }),
  buildPost({
    username: 'ellarose',
    displayName: 'Ella Rose',
    styleTypes: ['coquette', 'y2k'],
    title: 'Pink coquette',
    occasion: 'date',
    background: 'cafe',
    likes: 1320,
    createdAt: '2026-06-14T12:40:00Z',
    items: [
      { name: 'Bow cardigan', brand: 'With Jéan', price: 120, currency: 'USD', source: 'With Jéan', buyUrl: 'https://withjean.com', colors: ['#F4B8CE'], category: 'top' },
      { name: 'Pleated mini', brand: 'Princess Polly', price: 55, currency: 'USD', source: 'Princess Polly', buyUrl: 'https://www.princesspolly.com', colors: ['#E58AA6'], category: 'bottom' },
      { name: 'Ballet flats', brand: 'Repetto', price: 250, currency: 'USD', source: 'Repetto', buyUrl: 'https://www.repetto.com', colors: ['#F7D6E0'], category: 'shoes' },
      { name: 'Ribbon choker', brand: 'Brandy Melville', price: 12, currency: 'USD', source: 'Brandy Melville', buyUrl: 'https://us.brandymelville.com', colors: ['#E0708A'], category: 'accessory' },
    ],
  }),
  buildPost({
    username: 'theo.minimal',
    displayName: 'Theo',
    styleTypes: ['minimalist', 'old_money'],
    title: 'Quiet neutrals',
    occasion: 'work',
    background: 'white',
    likes: 389,
    createdAt: '2026-06-13T08:15:00Z',
    items: [
      { name: 'Cashmere crew', brand: 'Everlane', price: 130, currency: 'USD', source: 'Everlane', buyUrl: 'https://www.everlane.com', colors: ['#C8B6A6'], category: 'top' },
      { name: 'Wide trousers', brand: 'COS', price: 135, currency: 'USD', source: 'COS', buyUrl: 'https://www.cos.com', colors: ['#A89B86'], category: 'bottom' },
      { name: 'Leather loafers', brand: 'G.H. Bass', price: 175, currency: 'USD', source: 'G.H. Bass', buyUrl: 'https://www.ghbass.com', colors: ['#3A2A1E'], category: 'shoes' },
    ],
  }),
  buildPost({
    username: 'kai.gorp',
    displayName: 'Kai',
    styleTypes: ['gorpcore', 'athleisure'],
    title: 'Trailhead morning',
    occasion: 'climbing',
    background: 'garden',
    likes: 274,
    createdAt: '2026-06-12T07:00:00Z',
    items: [
      { name: 'Fleece pullover', brand: 'Patagonia', price: 159, currency: 'USD', source: 'Patagonia', buyUrl: 'https://www.patagonia.com', colors: ['#4A5D3A'], category: 'outerwear' },
      { name: 'Climbing pants', brand: "Arc'teryx", price: 140, currency: 'USD', source: "Arc'teryx", buyUrl: 'https://arcteryx.com', colors: ['#6E6B5E'], category: 'bottom' },
      { name: 'Approach shoes', brand: 'La Sportiva', price: 139, currency: 'USD', source: 'La Sportiva', buyUrl: 'https://www.lasportiva.com', colors: ['#2E2E32'], category: 'shoes' },
    ],
  }),
];
