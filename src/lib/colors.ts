/** Color helpers for placeholder tiles and avatars. */

export function isHex(s?: string | null): s is string {
  return !!s && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s);
}

/** First valid hex from an item's colors, or null. */
export function tileColor(colors?: string[] | null): string | null {
  const c = colors?.find(isHex);
  return c ?? null;
}

/** Pick black or white text for legibility on a hex background. */
export function readableOn(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#1A1A1A' : '#FFFFFF';
}

/** Deterministic pastel from a string (stable per name) for avatars. */
export function colorFromString(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return `hsl(${h}, 55%, 78%)`;
}
