/**
 * Static domain catalog: the style types, clothing categories, occasions,
 * seasons and avatar backgrounds that power onboarding, the wardrobe and the
 * outfit generator. Clothing categories render via <GarmentIcon>; occasions use
 * Ionicons. No emoji anywhere.
 */

// ─── Style types (onboarding) ────────────────────────────────────────────────

export const STYLE_TYPES = [
  { id: 'minimalist', label: 'Minimalist', blurb: 'Clean lines, neutral palette' },
  { id: 'streetwear', label: 'Streetwear', blurb: 'Hype, sneakers, oversized' },
  { id: 'old_money', label: 'Old Money', blurb: 'Quiet luxury, timeless tailoring' },
  { id: 'y2k', label: 'Y2K', blurb: 'Low-rise, baby tees, sparkle' },
  { id: 'cottagecore', label: 'Cottagecore', blurb: 'Floral, flowy, soft romance' },
  { id: 'casual', label: 'Everyday Casual', blurb: 'Comfy, easy, throw-on fits' },
  { id: 'grunge', label: 'Grunge / Emo', blurb: 'Dark, layered, edgy' },
  { id: 'academia', label: 'Dark Academia', blurb: 'Tweed, plaid, scholarly' },
  { id: 'athleisure', label: 'Athleisure', blurb: 'Sporty, sleek, on-the-go' },
  { id: 'boho', label: 'Boho', blurb: 'Free-spirited, earthy, eclectic' },
  { id: 'coquette', label: 'Coquette', blurb: 'Bows, lace, soft & flirty' },
  { id: 'techwear', label: 'Techwear', blurb: 'Utility, straps, monochrome' },
  { id: 'vintage', label: 'Vintage / Retro', blurb: 'Thrifted, decades, character' },
  { id: 'glam', label: 'Going-out Glam', blurb: 'Bold, dressy, statement' },
  { id: 'preppy', label: 'Preppy', blurb: 'Polished, collegiate, crisp' },
  { id: 'gorpcore', label: 'Gorpcore', blurb: 'Outdoorsy, functional, rugged' },
] as const;

export type StyleId = (typeof STYLE_TYPES)[number]['id'];

// ─── Clothing categories ─────────────────────────────────────────────────────
//
// `slot` groups items for outfit assembly; `layer` controls draw order on the
// avatar (higher = closer to the viewer). Icons render via <GarmentIcon category>.

export const CATEGORIES = [
  { id: 'top', label: 'Tops', slot: 'top', layer: 2 },
  { id: 'bottom', label: 'Bottoms', slot: 'bottom', layer: 1 },
  { id: 'dress', label: 'Dresses', slot: 'full', layer: 1 },
  { id: 'outerwear', label: 'Outerwear', slot: 'outerwear', layer: 3 },
  { id: 'shoes', label: 'Shoes', slot: 'shoes', layer: 0 },
  { id: 'bag', label: 'Bags', slot: 'bag', layer: 0 },
  { id: 'hat', label: 'Hats', slot: 'head', layer: 4 },
  { id: 'accessory', label: 'Accessories', slot: 'accessory', layer: 4 },
  { id: 'jewelry', label: 'Jewelry', slot: 'accessory', layer: 4 },
  { id: 'activewear', label: 'Activewear', slot: 'top', layer: 2 },
  { id: 'swimwear', label: 'Swimwear', slot: 'full', layer: 1 },
  { id: 'other', label: 'Other', slot: 'accessory', layer: 4 },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type Slot = (typeof CATEGORIES)[number]['slot'];

export const categoryById = (id: string) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

// ─── Occasions (outfit generator) ────────────────────────────────────────────
//
// `formality` (1 casual .. 5 black-tie) matches item formality; `active` flags
// athletic occasions that should pull from activewear. `icon` is an Ionicons name.

export const OCCASIONS = [
  { id: 'work', label: 'Work', icon: 'briefcase-outline', formality: 4, active: false },
  { id: 'school', label: 'School', icon: 'school-outline', formality: 2, active: false },
  { id: 'casual', label: 'Everyday', icon: 'cafe-outline', formality: 2, active: false },
  { id: 'date', label: 'Date', icon: 'heart-outline', formality: 4, active: false },
  { id: 'party', label: 'Party', icon: 'wine-outline', formality: 4, active: false },
  { id: 'formal', label: 'Formal', icon: 'diamond-outline', formality: 5, active: false },
  { id: 'gym', label: 'Gym', icon: 'barbell-outline', formality: 1, active: true },
  { id: 'climbing', label: 'Climbing', icon: 'trail-sign-outline', formality: 1, active: true },
  { id: 'travel', label: 'Travel', icon: 'airplane-outline', formality: 2, active: false },
  { id: 'brunch', label: 'Brunch', icon: 'restaurant-outline', formality: 3, active: false },
  { id: 'lounge', label: 'Lounge', icon: 'bed-outline', formality: 1, active: false },
  { id: 'beach', label: 'Beach', icon: 'sunny-outline', formality: 1, active: false },
] as const;

export type OccasionId = (typeof OCCASIONS)[number]['id'];

export const occasionById = (id?: string | null) =>
  OCCASIONS.find((o) => o.id === id) ?? OCCASIONS[2];

// ─── Seasons ─────────────────────────────────────────────────────────────────

export const SEASONS = [
  { id: 'spring', label: 'Spring' },
  { id: 'summer', label: 'Summer' },
  { id: 'fall', label: 'Fall' },
  { id: 'winter', label: 'Winter' },
] as const;

export type SeasonId = (typeof SEASONS)[number]['id'];

// ─── Avatar backgrounds (3D viewer / outfit staging) ─────────────────────────

export const BACKGROUNDS = [
  { id: 'white', label: 'Studio White', colors: ['#FFFFFF', '#ECECEF'] },
  { id: 'studio_black', label: 'Studio Black', colors: ['#23232A', '#050507'] },
  { id: 'redcarpet', label: 'Red Carpet', colors: ['#8E0E1C', '#3A0309'] },
  { id: 'cafe', label: 'Café', colors: ['#E8D6BE', '#BE9A6A'] },
  { id: 'garden', label: 'Garden', colors: ['#D2ECC4', '#84BD83'] },
  { id: 'sunset', label: 'Sunset', colors: ['#FFC3A0', '#FFAFBD'] },
] as const;

export type BackgroundId = (typeof BACKGROUNDS)[number]['id'];

export const backgroundById = (id?: string | null) =>
  BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
