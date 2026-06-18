import { createClient } from 'jsr:@supabase/supabase-js@2';

// refresh-catalog: re-check a batch of catalog items (oldest-checked first),
// updating price + in_stock. Discontinued / 404 items are KEPT and flagged
// in_stock = false. Triggered monthly by pg_cron (see migration), or on demand.

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

function attr(tag: string, name: string): string | undefined {
  const i = tag.toLowerCase().indexOf(name + '=');
  if (i < 0) return undefined;
  const j = i + name.length + 1;
  const code = tag.charCodeAt(j);
  if (code !== 34 && code !== 39) return undefined;
  const q = tag[j];
  const end = tag.indexOf(q, j + 1);
  return end < 0 ? undefined : tag.slice(j + 1, end);
}

function metaMap(html: string): Record<string, string> {
  const map: Record<string, string> = {};
  const low = html.toLowerCase();
  let i = 0;
  while (true) {
    const k = low.indexOf('<meta', i);
    if (k < 0) break;
    const end = html.indexOf('>', k);
    if (end < 0) break;
    const tag = html.slice(k, end + 1);
    const key = attr(tag, 'property') || attr(tag, 'name');
    const content = attr(tag, 'content');
    if (key && content != null) map[key.toLowerCase()] = content;
    i = end + 1;
  }
  return map;
}

function jsonLdProduct(html: string): any {
  const low = html.toLowerCase();
  let i = 0;
  while (true) {
    const k = low.indexOf('ld+json', i);
    if (k < 0) break;
    const gt = html.indexOf('>', k);
    const end = low.indexOf('</script>', gt);
    if (gt < 0 || end < 0) break;
    i = end + 9;
    try {
      const data = JSON.parse(html.slice(gt + 1, end).trim());
      const arr = Array.isArray(data) ? data : (data['@graph'] || [data]);
      const product = arr.find((x: any) => {
        const t = x && x['@type'];
        return t === 'Product' || (Array.isArray(t) && t.indexOf('Product') >= 0);
      });
      if (product) return product;
    } catch (_e) {
      // skip
    }
  }
  return null;
}

function toPrice(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  return isNaN(n) || n === 0 ? null : n;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  const { data: items } = await supabase
    .from('catalog_items')
    .select('id, buy_url, normalized_url')
    .order('last_checked_at', { ascending: true })
    .limit(40);

  let checked = 0;
  let discontinued = 0;
  for (const it of items || []) {
    const url = it.buy_url || it.normalized_url;
    if (!url) continue;
    checked++;
    let inStock = true;
    let price: number | null = null;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' }, redirect: 'follow' });
      if (res.status === 404 || res.status === 410) {
        inStock = false;
      } else {
        const html = (await res.text()).slice(0, 600000);
        const ld = jsonLdProduct(html);
        const meta = metaMap(html);
        let offer = ld && ld.offers;
        if (Array.isArray(offer)) offer = offer[0];
        const avail = String((offer && offer.availability) || meta['product:availability'] || meta['og:availability'] || '').toLowerCase();
        if (avail) inStock = !(avail.indexOf('outofstock') >= 0 || avail.indexOf('soldout') >= 0 || avail.indexOf('out_of_stock') >= 0);
        price = toPrice(offer && offer.price) ?? toPrice(meta['product:price:amount']);
      }
    } catch (_e) {
      // network error: leave in_stock as-is, just record the check time
    }
    if (!inStock) discontinued++;
    const patch: Record<string, unknown> = { in_stock: inStock, last_checked_at: new Date().toISOString() };
    if (price != null) patch.price = price;
    await supabase.from('catalog_items').update(patch).eq('id', it.id);
  }

  return json({ checked, discontinued });
});
