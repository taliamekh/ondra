/**
 * Append Onda's affiliate ref to a retailer URL. Currently a simple `ref=onda`
 * tag for demonstration — swap for per-retailer affiliate networks (e.g.
 * Skimlinks / rewardStyle deep links) when monetization is wired up.
 */
export function affiliateUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    u.searchParams.set('ref', 'onda');
    return u.toString();
  } catch {
    return url;
  }
}
