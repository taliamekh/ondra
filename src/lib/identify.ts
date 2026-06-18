import type { CategoryId, OccasionId, SeasonId, StyleId } from '@/constants/catalog';

export interface IdentifiedGarment {
  name: string;
  category: CategoryId;
  brand?: string;
  price?: number;
  currency: string;
  source?: string;
  buyUrl?: string;
  colors: string[];
  inStock: boolean;
  warmth: number;
  formality: number;
  seasons: SeasonId[];
  occasions: OccasionId[];
  styleTags: StyleId[];
  /** 0..1 confidence from the (mock) recognition model. */
  confidence: number;
}

export interface IdentifyResult {
  best: IdentifiedGarment;
  alternatives: IdentifiedGarment[];
}

const POOL: IdentifiedGarment[] = [
  { name: 'Ribbed knit cardigan', category: 'top', brand: 'Aritzia', price: 88, currency: 'USD', source: 'Aritzia', buyUrl: 'https://www.aritzia.com', colors: ['#D8C3A5'], inStock: true, warmth: 4, formality: 2, seasons: ['fall', 'winter'], occasions: ['casual', 'school', 'work'], styleTags: ['minimalist', 'academia'], confidence: 0.92 },
  { name: 'Vintage band tee', category: 'top', brand: 'Urban Outfitters', price: 39, currency: 'USD', source: 'Urban Outfitters', buyUrl: 'https://www.urbanoutfitters.com', colors: ['#2A2A2A'], inStock: false, warmth: 2, formality: 1, seasons: ['spring', 'summer', 'fall'], occasions: ['casual', 'school'], styleTags: ['grunge', 'vintage', 'streetwear'], confidence: 0.81 },
  { name: 'Wide-leg trousers', category: 'bottom', brand: 'COS', price: 115, currency: 'USD', source: 'COS', buyUrl: 'https://www.cos.com', colors: ['#3A3A40'], inStock: true, warmth: 3, formality: 4, seasons: ['spring', 'fall', 'winter'], occasions: ['work', 'date', 'formal'], styleTags: ['minimalist', 'old_money'], confidence: 0.9 },
  { name: 'Cargo mini skirt', category: 'bottom', brand: 'Princess Polly', price: 60, currency: 'USD', source: 'Princess Polly', buyUrl: 'https://www.princesspolly.com', colors: ['#7A7257'], inStock: true, warmth: 2, formality: 2, seasons: ['spring', 'summer'], occasions: ['casual', 'party', 'school'], styleTags: ['y2k', 'streetwear'], confidence: 0.86 },
  { name: 'Slip midi dress', category: 'dress', brand: 'Reformation', price: 198, currency: 'USD', source: 'Reformation', buyUrl: 'https://www.thereformation.com', colors: ['#8A2E43'], inStock: true, warmth: 2, formality: 4, seasons: ['spring', 'summer', 'fall'], occasions: ['date', 'party', 'formal'], styleTags: ['glam', 'minimalist'], confidence: 0.88 },
  { name: 'Quilted puffer jacket', category: 'outerwear', brand: 'Uniqlo', price: 99, currency: 'USD', source: 'Uniqlo', buyUrl: 'https://www.uniqlo.com', colors: ['#1E2A38'], inStock: true, warmth: 5, formality: 2, seasons: ['winter'], occasions: ['casual', 'travel'], styleTags: ['casual', 'gorpcore'], confidence: 0.93 },
  { name: 'Retro running sneakers', category: 'shoes', brand: 'New Balance', price: 130, currency: 'USD', source: 'New Balance', buyUrl: 'https://www.newbalance.com', colors: ['#C9C2B6'], inStock: true, warmth: 2, formality: 2, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['casual', 'school', 'travel'], styleTags: ['streetwear', 'athleisure', 'vintage'], confidence: 0.95 },
  { name: 'Mary Jane flats', category: 'shoes', brand: 'Sandy Liang', price: 245, currency: 'USD', source: 'SSENSE', buyUrl: 'https://www.ssense.com', colors: ['#1A1A1A'], inStock: false, warmth: 2, formality: 3, seasons: ['spring', 'fall'], occasions: ['date', 'school', 'brunch'], styleTags: ['coquette', 'academia'], confidence: 0.79 },
  { name: 'Canvas crossbody bag', category: 'bag', brand: 'Baggu', price: 42, currency: 'USD', source: 'Baggu', buyUrl: 'https://baggu.com', colors: ['#E3D9C6'], inStock: true, warmth: 3, formality: 2, seasons: ['spring', 'summer', 'fall', 'winter'], occasions: ['casual', 'travel', 'school'], styleTags: ['casual', 'minimalist'], confidence: 0.84 },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Identify a garment from a photo.
 *
 * ⚠️ MOCK IMPLEMENTATION — simulates a "snap → recognize → search the web for
 * the product, price and where to buy it" pipeline. Replace the body with a real
 * call to an image-recognition + product-search backend (e.g. an Edge Function
 * that runs CLIP / Google Vision and queries a retailer/affiliate search API).
 * The returned {@link IdentifyResult} shape — including editable name/source and
 * the `inStock` flag for discontinued items — is what the Add-item UI consumes,
 * so the screens won't need to change when the real service is wired in.
 */
export async function identifyGarment(_imageUri?: string): Promise<IdentifyResult> {
  await delay(1400);
  const i = Math.floor(Math.random() * POOL.length);
  const best = POOL[i];
  const alternatives = POOL.filter((_, idx) => idx !== i)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map((g) => ({ ...g, confidence: Math.max(0.4, g.confidence - 0.25) }));
  return { best, alternatives };
}
