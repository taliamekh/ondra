import { createClient } from 'jsr:@supabase/supabase-js@2';

// import-product: resolve a product URL into { name, image, price, ... } from
// JSON-LD / OpenGraph, then upsert it into the shared catalog.
//
// Many big retailers (Levi's, Veja, Madewell, anything behind Cloudflare/Akamai)
// block server-side fetches from datacenter IPs. To make ALL brands accessible we
// try, in order:
//   1. a direct fetch with realistic browser headers,
//   2. a paid rendering proxy IF a SCRAPER_API_KEY secret is set (ScraperAPI —
//      renders JS + rotates residential IPs; near-100% coverage),
//   3. the Wayback Machine archive (archive.org fetches the page, not us — free),
// using whichever first returns a usable product image.

const DQ = String.fromCharCode(34);
const SQ = String.fromCharCode(39);

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Upgrade-Insecure-Requests': '1',
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
      // skip
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
  if (has('sneaker', 'shoe', 'boot', 'heel', 'loafer', 'sandal', 'trainer', 'footwear', 'runner')) return 'shoes';
  if (has('dress', 'gown')) return 'dress';
  if (has('jean', 'trouser', 'pant', 'short', 'skirt', 'chino', 'cargo', 'legging')) return 'bottom';
  if (has('activewear', 'yoga', 'sportswear', 'sports bra')) return 'activewear';
  if (has('coat', 'jacket', 'blazer', 'parka', 'puffer', 'overcoat')) return 'outerwear';
  if (has('shirt', 'tee', 'blouse', 'sweater', 'hoodie', 'cardigan', 'knit', 'tank', 'polo', 'jumper', 'crew', 'top')) return 'top';
  if (has('bag', 'tote', 'backpack', 'purse', 'clutch', 'crossbody')) return 'bag';
  if (has('hat', 'cap', 'beanie', 'bucket')) return 'hat';
  if (has('ring', 'necklace', 'earring', 'bracelet', 'jewel')) return 'jewelry';
  if (has('sunglass', 'glasses', 'scarf', 'belt', 'glove')) return 'accessory';
  if (has('swim', 'bikini', 'trunks')) return 'swimwear';
  return 'other';
}

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

// Did the page come back as a bot-block / challenge instead of the product?
function looksBlocked(html: string, status: number): boolean {
  if (status >= 400) return true;
  const h = html.slice(0, 8000).toLowerCase();
  return [
    'access denied',
    'attention required',
    'just a moment',
    'are you a robot',
    'verify you are a human',
    'captcha',
    'cf-browser-verification',
    'enable javascript and cookies',
  ].some((m) => h.indexOf(m) >= 0);
}

function badName(name: string | undefined): boolean {
  if (!name) return true;
  const n = name.toLowerCase();
  return ['access denied', 'attention required', 'just a moment', 'forbidden', 'not found', '404', 'error', 'denied'].some((m) => n.indexOf(m) >= 0);
}

// Strip the Wayback Machine prefix so we keep the ORIGINAL CDN image URL
// (e.g. .../web/20260410203216im_/https://lsco.scene7.com/... -> https://lsco.scene7.com/...).
function stripWayback(u: string): string {
  const m = u.indexOf('web.archive.org/web/');
  if (m < 0) return u;
  const slash = u.indexOf('/', m + 'web.archive.org/web/'.length);
  return slash < 0 ? u : u.slice(slash + 1);
}

interface Parsed {
  name: string;
  image: string | null;
  brand: string | null;
  price: number | null;
  currency: string;
  inStock: boolean;
  source: string | null;
  category: string;
}

function parse(html: string): Parsed {
  const ld = jsonLdProduct(html);
  const meta = metaMap(html);
  const name = (ld && ld.name && decodeEntities(ld.name)) || meta['og:title'] || meta['twitter:title'] || titleText(html) || 'Imported item';
  const image = (ld && firstImage(ld.image)) || meta['og:image'] || meta['twitter:image'] || null;
  const brand = (ld && (typeof ld.brand === 'object' ? ld.brand && ld.brand.name : ld.brand)) || meta['og:brand'] || null;
  let offer = ld && ld.offers;
  if (Array.isArray(offer)) offer = offer[0];
  const price = toPrice(offer && (offer.price || offer.lowPrice)) ?? toPrice(meta['product:price:amount']) ?? toPrice(meta['og:price:amount']);
  const currency = (offer && offer.priceCurrency) || meta['product:price:currency'] || 'USD';
  const avail = String((offer && offer.availability) || meta['product:availability'] || meta['og:availability'] || '').toLowerCase();
  const inStock = !(avail.indexOf('outofstock') >= 0 || avail.indexOf('out_of_stock') >= 0 || avail.indexOf('soldout') >= 0 || avail.indexOf('out of stock') >= 0);
  return { name: String(name).slice(0, 200), image, brand, price, currency, inStock, source: meta['og:site_name'] || null, category: guessCategory(name + ' ' + (ld?.category ?? '')) };
}

async function safe<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch (_e) {
    return null;
  }
}

async function fetchDirect(url: string): Promise<{ status: number; html: string }> {
  const res = await fetch(url, { headers: BROWSER_HEADERS, redirect: 'follow' });
  return { status: res.status, html: (await res.text()).slice(0, 900000) };
}

async function fetchScraper(url: string, key: string): Promise<string | null> {
  // ScraperAPI-compatible: renders JS + rotates residential IPs.
  const api = 'http://api.scraperapi.com/?api_key=' + key + '&url=' + encodeURIComponent(url);
  const res = await fetch(api);
  return res.ok ? (await res.text()).slice(0, 900000) : null;
}

async function fetchWayback(url: string): Promise<string | null> {
  const a = await fetch('https://archive.org/wayback/available?url=' + encodeURIComponent(url));
  const j = await a.json();
  const snap = j && j.archived_snapshots && j.archived_snapshots.closest;
  if (!snap || !snap.available || !snap.url) return null;
  const res = await fetch(snap.url, { redirect: 'follow' });
  return res.ok ? (await res.text()).slice(0, 1500000) : null;
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
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalized);
  } catch (_e) {
    return json({ error: 'Invalid URL' }, 400);
  }
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') return json({ error: 'URL not allowed' }, 400);
  if (blockedHost(parsedUrl.hostname)) return json({ error: 'URL not allowed' }, 400);

  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  const existing = await supabase.from('catalog_items').select('*').eq('normalized_url', normalized).maybeSingle();
  if (existing.data) {
    await supabase.from('catalog_items').update({ times_added: (existing.data.times_added || 0) + 1 }).eq('id', existing.data.id);
    return json({ source: 'catalog', item: existing.data });
  }

  let parsed: Parsed | null = null;
  let via = 'web';

  // 1) Direct fetch.
  const direct = await safe(fetchDirect(normalized));
  if (direct && !looksBlocked(direct.html, direct.status)) parsed = parse(direct.html);

  const needFallback = () => !parsed || !parsed.image || badName(parsed.name);

  // 2) Paid rendering proxy (only if a key is configured).
  if (needFallback()) {
    const key = Deno.env.get('SCRAPER_API_KEY') || Deno.env.get('SCRAPINGBEE_API_KEY');
    if (key) {
      const sh = await safe(fetchScraper(normalized, key));
      if (sh) {
        const p = parse(sh);
        if (p.image && !badName(p.name)) {
          parsed = p;
          via = 'proxy';
        }
      }
    }
  }

  // 3) Wayback Machine archive (free, bypasses IP blocks).
  if (needFallback()) {
    const wh = await safe(fetchWayback(normalized));
    if (wh) {
      const p = parse(wh);
      if (p.image) {
        p.image = stripWayback(p.image);
        parsed = p;
        via = 'archive';
      }
    }
  }

  if (!parsed) parsed = { name: 'Imported item', image: null, brand: null, price: null, currency: 'USD', inStock: true, source: null, category: 'other' };

  const host = parsedUrl.hostname.indexOf('www.') === 0 ? parsedUrl.hostname.slice(4) : parsedUrl.hostname;
  const row = {
    normalized_url: normalized,
    name: parsed.name,
    brand: parsed.brand,
    price: parsed.price,
    currency: parsed.currency,
    source: parsed.source || host,
    buy_url: url,
    image_url: parsed.image,
    category: parsed.category,
    in_stock: parsed.inStock,
    last_checked_at: new Date().toISOString(),
    times_added: 1,
  };
  const up = await supabase.from('catalog_items').upsert(row, { onConflict: 'normalized_url' }).select().single();
  return json({ source: via, item: up.data || row });
});
