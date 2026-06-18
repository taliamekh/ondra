// Representative clothing photos used as a placeholder when an item has no real
// photo yet (real items get an accurate photo from the camera scan, a pasted
// link's og:image, or the catalog). loremflickr returns a real Flickr photo for
// the keyword; `lock` keeps a given seed stable so the tile doesn't change.

const IMG_KEYWORD: Record<string, string> = {
  top: 'tshirt',
  bottom: 'jeans',
  dress: 'dress',
  outerwear: 'jacket',
  shoes: 'sneakers',
  bag: 'handbag',
  hat: 'hat',
  accessory: 'sunglasses',
  jewelry: 'necklace',
  activewear: 'leggings',
  swimwear: 'swimsuit',
  other: 'clothing',
};

/** A small stable hash of a string, for picking a consistent placeholder photo. */
export function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** A representative clothing photo for a category. Same seed -> same photo. */
export function stockImage(category?: string | null, seed: number | string = 0): string {
  const kw = IMG_KEYWORD[category ?? 'other'] ?? 'clothing';
  const n = typeof seed === 'number' ? seed : seedFromString(seed);
  return `https://loremflickr.com/400/500/${kw}?lock=${(n % 100000) + 1}`;
}
