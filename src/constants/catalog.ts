/**
 * Static domain catalog: the style types, clothing categories, occasions,
 * seasons and avatar backgrounds that power onboarding, the wardrobe and the
 * outfit generator. Kept in one place so the recommendation logic and the UI
 * stay in sync.
 */

// ─── Style types (onboarding) ────────────────────────────────────────────────

export const STYLE_TYPES = [
  { id: 'minimalist', label: 'Minimalist', emoji: '🤍', blurb: 'Clean lines, neutral palette' },
  { id: 'streetwear', label: 'Streetwear', emoji: '🛹', blurb: 'Hype, sneakers, oversized' },
  { id: 'old_money', label: 'Old Money', emoji: '🏇', blurb: 'Quiet luxury, timeless tailoring' },
  { id: 'y2k', label: 'Y2K', emoji: '💿', blurb: 'Low-rise, baby tees, sparkle' },
  { id: 'cottagecore', label: 'Cottagecore', emoji: '🌾', blurb: 'Floral, flowy, soft romance' },
  { id: 'casual', label: 'Everyday Casual', emoji: '👖', blurb: 'Comfy, easy, throw-on fits' },
  { id: 'grunge', label: 'Grunge / Emo', emoji: '🖤', blurb: 'Dark, layered, edgy' },
  { id: 'academia', label: 'Dark Academia', emoji: '📚', blurb: 'Tweed, plaid, scholarly' },
  { id: 'athleisure', label: 'Athleisure', emoji: '🏃', blurb: 'Sporty, sleek, on-the-go' },
  { id: 'boho', label: 'Boho', emoji: '🪶', blurb: 'Free-spirited, earthy, eclectic' },
  { id: 'coquette', label: 'Coquette', emoji: '🎀', blurb: 'Bows, lace, soft & flirty' },
  { id: 'techwear', label: 'Techwear', emoji: '🥷', blurb: 'Utility, straps, monochrome' },
  { id: 'vintage', label: 'Vintage / Retro', emoji: '📻', blurb: 'Thrifted, decades, character' },
  { id: 'glam', label: 'Going-out Glam', emoji: '✨', blurb: 'Bold, dressy, statement' },
  { id: 'preppy', label: 'Preppy', emoji: '🎾', blurb: 'Polished, collegiate, crisp' },
  { id: 'gorpcore', label: 'Gorpcore', emoji: '🧗', blurb: 'Outdoorsy, functional, rugged' },
] as const;

export type StyleId = (typeof STYLE_TYPES)[number]['id'];

// ─── Clothing categories ─────────────────────────────────────────────────────
//
// `slot` groups items for outfit assembly; `layer` controls draw order on the
// avatar (higher = closer to the viewer).

export const CATEGORIES = [
  { id: 'top', label: 'Tops', emoji: '👕', slot: 'top', layer: 2 },
  { id: 'bottom', label: 'Bottoms', emoji: '👖', slot: 'bottom', layer: 1 },
  { id: 'dress', label: 'Dresses', emoji: '👗', slot: 'full', layer: 1 },
  { id: 'outerwear', label: 'Outerwear', emoji: '🧥', slot: 'outerwear', layer: 3 },
  { id: 'shoes', label: 'Shoes', emoji: '👟', slot: 'shoes', layer: 0 },
  { id: 'bag', label: 'Bags', emoji: '👜', slot: 'bag', layer: 0 },
  { id: 'hat', label: 'Hats', emoji: '🧢', slot: 'head', layer: 4 },
  { id: 'accessory', label: 'Accessories', emoji: '🕶️', slot: 'accessory', layer: 4 },
  { id: 'jewelry', label: 'Jewelry', emoji: '💍', slot: 'accessory', layer: 4 },
  { id: 'activewear', label: 'Activewear', emoji: '🩳', slot: 'top', layer: 2 },
  { id: 'swimwear', label: 'Swimwear', emoji: '🩱', slot: 'full', layer: 1 },
  { id: 'other', label: 'Other', emoji: '🧣', slot: 'accessory', layer: 4 },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type Slot = (typeof CATEGORIES)[number]['slot'];

export const categoryById = (id: string) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

// ─── Occasions (outfit generator) ────────────────────────────────────────────
//
// `formality` (1 casual .. 5 black-tie) matches item formality; `active` flags
// athletic occasions that should pull from activewear.

export const OCCASIONS = [
  { id: 'work', label: 'Work', emoji: '💼', formality: 4, active: false },
  { id: 'school', label: 'School', emoji: '🎒', formality: 2, active: false },
  { id: 'casual', label: 'Everyday', emoji: '☕', formality: 2, active: false },
  { id: 'date', label: 'Date', emoji: '💕', formality: 4, active: false },
  { id: 'party', label: 'Party', emoji: '🎉', formality: 4, active: false },
  { id: 'formal', label: 'Formal', emoji: '🥂', formality: 5, active: false },
  { id: 'gym', label: 'Gym', emoji: '🏋️', formality: 1, active: true },
  { id: 'climbing', label: 'Climbing', emoji: '🧗', formality: 1, active: true },
  { id: 'travel', label: 'Travel', emoji: '✈️', formality: 2, active: false },
  { id: 'brunch', label: 'Brunch', emoji: '🥐', formality: 3, active: false },
  { id: 'lounge', label: 'Lounge', emoji: '🛋️', formality: 1, active: false },
  { id: 'beach', label: 'Beach', emoji: '🏖️', formality: 1, active: false },
] as const;

export type OccasionId = (typeof OCCASIONS)[number]['id'];

export const occasionById = (id?: string | null) =>
  OCCASIONS.find((o) => o.id === id) ?? OCCASIONS[2];

// ─── Seasons ─────────────────────────────────────────────────────────────────

export const SEASONS = [
  { id: 'spring', label: 'Spring', emoji: '🌷' },
  { id: 'summer', label: 'Summer', emoji: '☀️' },
  { id: 'fall', label: 'Fall', emoji: '🍂' },
  { id: 'winter', label: 'Winter', emoji: '❄️' },
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
