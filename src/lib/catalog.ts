import type { CategoryId } from '@/constants/catalog';
import { supabase } from '@/lib/supabase';

/** A product resolved from the catalog or a pasted link (ready to prefill the editor). */
export interface ImportedProduct {
  name: string;
  brand?: string | null;
  price?: number | null;
  currency: string;
  source?: string | null;
  buyUrl?: string | null;
  imageUrl?: string | null;
  category: CategoryId;
  inStock: boolean;
}

/**
 * Resolve a product from a pasted link via the `import-product` Edge Function,
 * which fetches the page server-side, reads its name/image/price/availability,
 * and adds it to the shared catalog. Returns null if it couldn't be reached.
 */
export async function importFromLink(url: string): Promise<ImportedProduct | null> {
  try {
    const { data, error } = await supabase.functions.invoke('import-product', { body: { url } });
    const item = (data as { item?: Record<string, unknown> } | null)?.item;
    if (error || !item) return null;
    return {
      name: (item.name as string) ?? 'Imported item',
      brand: (item.brand as string) ?? null,
      price: (item.price as number) ?? null,
      currency: (item.currency as string) ?? 'USD',
      source: (item.source as string) ?? null,
      buyUrl: (item.buy_url as string) ?? url,
      imageUrl: (item.image_url as string) ?? null,
      category: ((item.category as string) ?? 'other') as CategoryId,
      inStock: (item.in_stock as boolean) ?? true,
    };
  } catch {
    return null;
  }
}
