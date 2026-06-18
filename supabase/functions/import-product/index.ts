import { createClient } from 'jsr:@supabase/supabase-js@2';

// import-product: given a product URL, fetch the page server-side and read its
// title / image / price / availability from JSON-LD or OpenGraph tags, then
// upsert it into the shared catalog. Web fetch must run server-side (browsers
// block cross-site requests, and we keep scraping off the client).

const DQ = String.fromCharCode(34); // double quote
const SQ = String.fromCharCode(39); // single quote

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

function decodeEntities(s: unknown): string {
  return String(s)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, DQ)
    .replace(/&#0?39;/g, SQ)
    .replace(/&#x27;/gi, SQ)
    .replace(/&nbsp;/g, ' ')
    .trim();
}

// Read an attribute value from one tag, detecting the quote char at runtime so
// we never have to put a quote character inside a regular expression.
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
    if (key && content != null) map[key.toLowerCase()] = decodeEntities(content);
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
      // skip unparseable block
    }
  }
  return null;
}

function titleText(html: string): string | undefined {
  const low = html.toLowerCase();
  const k = low.indexOf('<title');
  if (k < 0) return undefined;
  const gt = html.indexOf('>', k);
  const end = low.indexOf('</title>', gt);
  if (gt < 0 || end < 0) return undefined;
  return decodeEntities(html.slice(gt + 1, end));
}

function firstImage(v: any): string | undefined {
  if (!v) return undefined;
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return firstImage(v[0]);
  if (typeof v === 'object') return v.url || v['@id'] || undefined;
  return undefined;
}

function guessCategory(text: string): string {
  const t = (text || '').toLowerCase();
  const has = (...ws: string[]) => ws.some((w) => t.indexOf(w) >= 0);
  if (has('sneaker', 'shoe', 'boot', 'heel', 'loafer', 'sandal', 'trainer', 'footwear')) return 'shoes';
  if (has('dress', 'gown')) return 'dress';
  if (has('jean', 'trouser', 'pant', 'short', 'skirt', 'chino', 'cargo')) return 'bottom';
  if (has('legging', 'activewear', 'yoga', 'sportswear')) return 'activewear';
  if (has('coat', 'jacket', 'blazer', 'parka', 'puffer', 'overcoat')) return 'outerwear';
  if (has('shirt', 'tee', 'blouse', 'sweater', 'hoodie', 'cardigan', 'knit', 'tank', 'polo', 'jumper', 'top')) return 'top';
  if (has('bag', 'tote', 'backpack', 'purse', 'clutch', 'crossbody')) return 'bag';
  if (has('hat', 'cap', 'beanie', 'bucket')) return 'hat';
  if (has('ring', 'necklace', 'earring', 'bracelet', 'jewel')) return 'jewelry';
  if (has('sunglass', 'glasses', 'scarf', 'belt', 'glove')) return 'accessory';
  if (has('swim', 'bikini', 'trunks')) return 'swimwear';
  return 'other';
}

// Block private / internal hosts (basic SSRF protection).
function blockedHost(h: string): boolean {
  h = h.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local')) return true;
  if (h.startsWith('127.') || h.startsWith('10.') || h.startsWith('192.168.') || h.startsWith('169.254.') || h.startsWith('0.')) return true;
  if (h.startsWith('172.')) {
    const o = parseInt(h.split('.')[1] || '0', 10);
    if (o >= 16 && o <= 31) return true;
  }
  return false;
}

function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.hash = '';
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'fbclid', 'gclid'].forEach((p) => u.searchParams.delete(p));
    u.host = u.host.toLowerCase();
    return u.toString();
  } catch (_e) {
    return raw;
  }
}

function toPrice(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  return isNaN(n) || n === 0 ? null : n;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  let url: string | undefined;
  try {
    url = (await req.json()).url;
  } catch (_e) {
    return json({ error: 'Invalid body' }, 400);
  }
  if (!url) return json({ error: 'Missing url' }, 400);

  const normalized = normalizeUrl(url);
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch (_e) {
    return json({ error: 'Invalid URL' }, 400);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return json({ error: 'URL not allowed' }, 400);
  if (blockedHost(parsed.hostname)) return json({ error: 'URL not allowed' }, 400);

  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  // 1) Already in the catalog? Return it and bump popularity.
  const existing = await supabase.from('catalog_items').select('*').eq('normalized_url', normalized).maybeSingle();
  if (existing.data) {
    await supabase.from('catalog_items').update({ times_added: (existing.data.times_added || 0) + 1 }).eq('id', existing.data.id);
    return json({ source: 'catalog', item: existing.data });
  }

  // 2) Fetch + parse the page.
  let html = '';
  try {
    const res = await fetch(normalized, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });
    html = (await res.text()).slice(0, 800000);
  } catch (e) {
    return json({ error: 'Could not reach the page', detail: String(e) }, 502);
  }

  const ld = jsonLdProduct(html);
  const meta = metaMap(html);
  const host = parsed.hostname.indexOf('www.') === 0 ? parsed.hostname.slice(4) : parsed.hostname;

  const name = (ld && ld.name && decodeEntities(ld.name)) || meta['og:title'] || meta['twitter:title'] || titleText(html) || 'Imported item';
  const image = (ld && firstImage(ld.image)) || meta['og:image'] || meta['twitter:image'] || null;
  const brand = (ld && (typeof ld.brand === 'object' ? ld.brand && ld.brand.name : ld.brand)) || meta['og:brand'] || null;

  let offer = ld && ld.offers;
  if (Array.isArray(offer)) offer = offer[0];
  const price = toPrice(offer && offer.price) ?? toPrice(meta['product:price:amount']);
  const currency = (offer && offer.priceCurrency) || meta['product:price:currency'] || 'USD';
  const avail = String((offer && offer.availability) || meta['product:availability'] || meta['og:availability'] || '').toLowerCase();
  const inStock = !(avail.indexOf('outofstock') >= 0 || avail.indexOf('out_of_stock') >= 0 || avail.indexOf('soldout') >= 0 || avail.indexOf('out of stock') >= 0);
  const source = meta['og:site_name'] || host || null;
  const category = guessCategory(name + ' ' + ((ld && ld.category) || ''));

  const row = {
    normalized_url: normalized,
    name: String(name).slice(0, 200),
    brand,
    price,
    currency,
    source,
    buy_url: url,
    image_url: image,
    category,
    in_stock: inStock,
    last_checked_at: new Date().toISOString(),
    times_added: 1,
  };
  const up = await supabase.from('catalog_items').upsert(row, { onConflict: 'normalized_url' }).select().single();
  return json({ source: 'web', item: up.data || row });
});
