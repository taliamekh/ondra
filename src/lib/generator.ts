import { categoryById, occasionById, type OccasionId, type SeasonId, type StyleId } from '@/constants/catalog';
import { newId } from '@/lib/id';
import type { ClothingItem, ItemSnapshot, WeatherSnapshot } from '@/types/models';

export interface GeneratedOutfit {
  id: string;
  title: string;
  items: ClothingItem[];
  score: number;
  rationale: string[];
}

interface GenOptions {
  occasion: OccasionId;
  weather?: WeatherSnapshot | null;
  styleTypes: StyleId[];
  /** Changing the seed reshuffles candidate ordering for "regenerate". */
  seed?: number;
}

/** Convert a closet item into the public snapshot stored on saved outfits. */
export function itemToSnapshot(item: ClothingItem): ItemSnapshot {
  return {
    name: item.name,
    brand: item.brand,
    imageUrl: item.imageUrl,
    thumbUrl: item.thumbUrl,
    price: item.price,
    currency: item.currency,
    source: item.source,
    buyUrl: item.buyUrl,
    inStock: item.inStock,
    category: item.category,
    colors: item.colors,
  };
}

function warmthTargetFor(tempC?: number | null): number {
  if (tempC == null) return 3;
  if (tempC >= 26) return 1;
  if (tempC >= 18) return 2;
  if (tempC >= 10) return 3;
  if (tempC >= 2) return 4;
  return 5;
}

function currentSeason(): SeasonId {
  const m = new Date().getMonth();
  if (m <= 1 || m === 11) return 'winter';
  if (m <= 4) return 'spring';
  if (m <= 7) return 'summer';
  return 'fall';
}

interface Ctx {
  targetFormality: number;
  targetWarmth: number;
  styleSet: Set<string>;
  occasion: OccasionId;
  season: SeasonId;
}

function scoreItem(item: ClothingItem, ctx: Ctx): number {
  let s = 0;
  s += 3 - Math.min(3, Math.abs(item.formality - ctx.targetFormality));
  s += (2 - Math.min(2, Math.abs(item.warmth - ctx.targetWarmth))) * 0.8;
  s += item.styleTags.filter((t) => ctx.styleSet.has(t)).length * 1.5;
  if (item.occasions.includes(ctx.occasion)) s += 2;
  if (item.seasons.includes(ctx.season)) s += 1;
  return s;
}

function slotOf(item: ClothingItem): string {
  return categoryById(item.category).slot;
}

function rotate<T>(arr: T[], by: number): T[] {
  if (arr.length < 2) return arr;
  const n = ((by % arr.length) + arr.length) % arr.length;
  return [...arr.slice(n), ...arr.slice(0, n)];
}

/**
 * Generate up to four outfit options from the user's owned items, ranked by how
 * well they fit the occasion, weather and the user's style profile.
 */
export function generateOutfits(items: ClothingItem[], opts: GenOptions): GeneratedOutfit[] {
  const occ = occasionById(opts.occasion);
  const ctx: Ctx = {
    targetFormality: occ.formality,
    targetWarmth: warmthTargetFor(opts.weather?.tempC),
    styleSet: new Set(opts.styleTypes),
    occasion: opts.occasion,
    season: currentSeason(),
  };
  const seed = opts.seed ?? 0;

  const owned = items.filter((i) => !i.isWishlist);
  const pool = occ.active
    ? owned.filter((i) => i.category === 'activewear' || i.occasions.includes(opts.occasion) || i.formality <= 2)
    : owned;

  const bySlot = (slot: string) =>
    rotate(
      pool.filter((i) => slotOf(i) === slot).sort((a, b) => scoreItem(b, ctx) - scoreItem(a, ctx)),
      seed,
    );

  const tops = bySlot('top');
  const bottoms = bySlot('bottom');
  const dresses = bySlot('full');
  const shoes = bySlot('shoes');
  const outerwear = bySlot('outerwear');
  const bags = bySlot('bag');
  const accessories = bySlot('accessory');

  const combos: ClothingItem[][] = [];

  // Strategy 1 — separates (top + bottom)
  for (const top of tops.slice(0, 3)) {
    for (const bottom of bottoms.slice(0, 2)) {
      combos.push([top, bottom]);
    }
  }
  // Strategy 2 — dresses (one-piece)
  if (!occ.active) {
    for (const dress of dresses.slice(0, 2)) combos.push([dress]);
  }

  const wantsOuterwear = ctx.targetWarmth >= 4 && outerwear.length > 0;

  const built = combos.map((base) => {
    const picks = [...base];
    if (shoes[0]) picks.push(shoes[0]);
    if (wantsOuterwear) picks.push(outerwear[0]);
    if (!occ.active && bags[0]) picks.push(bags[0]);
    if (!occ.active && accessories[0]) picks.push(accessories[0]);
    const score = picks.reduce((sum, i) => sum + scoreItem(i, ctx), 0);
    return { picks, score };
  });

  // Dedupe by the set of item ids, keep the best-scoring, return up to 4.
  const seen = new Set<string>();
  const unique = built
    .sort((a, b) => b.score - a.score)
    .filter((b) => {
      const key = b.picks.map((i) => i.id).sort().join('|');
      if (seen.has(key) || b.picks.length < 2) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4);

  return unique.map((b, idx) => ({
    id: newId('gen_'),
    title: outfitTitle(opts, idx),
    items: b.picks,
    score: Math.round(b.score * 10) / 10,
    rationale: buildRationale(ctx, opts),
  }));
}

function outfitTitle(opts: GenOptions, idx: number): string {
  const occ = occasionById(opts.occasion);
  const vibes = ['Option', 'Take', 'Look', 'Pick'];
  const temp = opts.weather ? ` · ${opts.weather.tempC}°` : '';
  return `${occ.label}${temp} · ${vibes[idx % vibes.length]} ${idx + 1}`;
}

function buildRationale(ctx: Ctx, opts: GenOptions): string[] {
  const out: string[] = [];
  const occ = occasionById(opts.occasion);
  if (opts.weather) {
    out.push(`Tuned for ${opts.weather.tempC}° (${opts.weather.condition})`);
  }
  out.push(`Formality matched to ${occ.label.toLowerCase()}`);
  if (ctx.styleSet.size) out.push(`Leans into your saved styles`);
  return out;
}
