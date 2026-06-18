import { newId } from '@/lib/id';
import type { FeedPost, ItemSnapshot, Outfit, OutfitItem } from '@/types/models';

import type { NewClothingItem } from './repository';

/**
 * A starter wardrobe seeded for brand-new users so the closet and the outfit
 * generator feel alive immediately. Users can edit or delete any of these.
 * (Items have no photo, so ItemTile shows a representative category photo.)
 */
export const STARTER_CLOSET: NewClothingItem[] = [
  { name: 'Everyday white tee', category: 'top', colors: ['#F5F5F5'], brand: 'Uniqlo', price: 15, source: 'Uniqlo', buyUrl: 'https://www.uniqlo.com', warmth: 2, formality: 2, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['casual', 'school', 'work'], styleTags: ['minimalist', 'casual'] },
  { name: 'Black ribbed tank', category: 'top', colors: ['#1A1A1A'], brand: 'Aritzia', price: 35, source: 'Aritzia', buyUrl: 'https://www.aritzia.com', warmth: 1, formality: 2, seasons: ['spring', 'summer'], occasions: ['casual', 'date', 'party'], styleTags: ['minimalist', 'glam'] },
  { name: 'Oversized knit sweater', category: 'top', colors: ['#C8B6A6'], brand: 'COS', price: 89, source: 'COS', buyUrl: 'https://www.cos.com', warmth: 4, formality: 2, seasons: ['fall', 'winter'], occasions: ['casual', 'school', 'work'], styleTags: ['minimalist', 'academia'] },
  { name: 'Striped oxford shirt', category: 'top', colors: ['#9DB4D4'], brand: 'J.Crew', price: 78, source: 'J.Crew', buyUrl: 'https://www.jcrew.com', warmth: 2, formality: 3, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['work', 'school', 'brunch'], styleTags: ['preppy', 'old_money'] },
  { name: 'Straight-leg jeans', category: 'bottom', colors: ['#5B7DA6'], brand: "Levi's", price: 98, source: "Levi's", buyUrl: 'https://www.levi.com', warmth: 3, formality: 2, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['casual', 'school', 'date', 'brunch'], styleTags: ['casual', 'vintage', 'streetwear'] },
  { name: 'Tailored trousers', category: 'bottom', colors: ['#23232A'], brand: 'Aritzia', price: 128, source: 'Aritzia', buyUrl: 'https://www.aritzia.com', warmth: 3, formality: 4, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['work', 'date', 'formal'], styleTags: ['minimalist', 'old_money'] },
  { name: 'Pleated mini skirt', category: 'bottom', colors: ['#6B2737'], brand: 'Princess Polly', price: 55, source: 'Princess Polly', buyUrl: 'https://www.princesspolly.com', warmth: 2, formality: 3, seasons: ['spring', 'summer', 'fall'], occasions: ['date', 'party', 'school'], styleTags: ['coquette', 'y2k', 'academia'] },
  { name: 'Cargo pants', category: 'bottom', colors: ['#6E6B5E'], brand: 'Carhartt WIP', price: 98, source: 'Carhartt', buyUrl: 'https://www.carhartt-wip.com', warmth: 3, formality: 1, seasons: ['spring', 'fall'], occasions: ['casual'], styleTags: ['streetwear', 'techwear', 'gorpcore'] },
  { name: 'Little black dress', category: 'dress', colors: ['#161616'], brand: 'Reformation', price: 178, source: 'Reformation', buyUrl: 'https://www.thereformation.com', warmth: 2, formality: 4, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['date', 'party', 'formal'], styleTags: ['glam', 'minimalist'] },
  { name: 'Floral midi dress', category: 'dress', colors: ['#D98AA6'], brand: 'Sézane', price: 165, source: 'Sézane', buyUrl: 'https://www.sezane.com', warmth: 2, formality: 3, seasons: ['spring', 'summer'], occasions: ['brunch', 'date', 'casual'], styleTags: ['cottagecore', 'boho'] },
  { name: 'Denim jacket', category: 'outerwear', colors: ['#7C97B8'], brand: "Levi's", price: 110, source: "Levi's", buyUrl: 'https://www.levi.com', warmth: 3, formality: 2, seasons: ['spring', 'fall'], occasions: ['casual', 'school'], styleTags: ['casual', 'vintage'] },
  { name: 'Wool overcoat', category: 'outerwear', colors: ['#2B2B30'], brand: 'Mango', price: 199, source: 'Mango', buyUrl: 'https://shop.mango.com', warmth: 5, formality: 4, seasons: ['winter'], occasions: ['work', 'formal', 'date'], styleTags: ['minimalist', 'old_money'] },
  { name: 'White leather sneakers', category: 'shoes', colors: ['#FAFAFA'], brand: 'Common Projects', price: 215, source: 'SSENSE', buyUrl: 'https://www.ssense.com', warmth: 2, formality: 2, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['casual', 'school', 'work', 'brunch'], styleTags: ['minimalist', 'streetwear'] },
  { name: 'Black ankle boots', category: 'shoes', colors: ['#1C1C1C'], brand: 'Dr. Martens', price: 170, source: 'Dr. Martens', buyUrl: 'https://www.drmartens.com', warmth: 3, formality: 3, seasons: ['fall', 'winter'], occasions: ['casual', 'date', 'party'], styleTags: ['grunge', 'streetwear'] },
  { name: 'Strappy heels', category: 'shoes', colors: ['#C9A14A'], brand: 'Steve Madden', price: 95, source: 'Steve Madden', buyUrl: 'https://www.stevemadden.com', warmth: 1, formality: 5, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['party', 'formal', 'date'], styleTags: ['glam'] },
  { name: 'Leather tote', category: 'bag', colors: ['#6B4F3A'], brand: 'Madewell', price: 168, source: 'Madewell', buyUrl: 'https://www.madewell.com', warmth: 3, formality: 3, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['work', 'school', 'travel'], styleTags: ['old_money', 'minimalist'] },
  { name: 'Gold hoop earrings', category: 'jewelry', colors: ['#D4AF37'], brand: 'Mejuri', price: 75, source: 'Mejuri', buyUrl: 'https://www.mejuri.com', warmth: 3, formality: 3, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['date', 'party', 'work'], styleTags: ['glam', 'minimalist'] },
  { name: 'Seamless leggings', category: 'activewear', colors: ['#23232A'], brand: 'Lululemon', price: 98, source: 'Lululemon', buyUrl: 'https://shop.lululemon.com', warmth: 2, formality: 1, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['gym', 'climbing', 'lounge'], styleTags: ['athleisure'] },
  { name: 'Sports tank', category: 'activewear', colors: ['#3A6E8F'], brand: 'Nike', price: 40, source: 'Nike', buyUrl: 'https://www.nike.com', warmth: 1, formality: 1, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['gym', 'climbing'], styleTags: ['athleisure'] },
  { name: 'Trail runners', category: 'shoes', colors: ['#4A5D3A'], brand: 'Salomon', price: 145, source: 'Salomon', buyUrl: 'https://www.salomon.com', warmth: 2, formality: 1, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['gym', 'climbing', 'travel'], styleTags: ['gorpcore', 'athleisure'] },
];

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
