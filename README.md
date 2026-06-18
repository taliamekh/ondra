# 👗 Onda

**Your closet, styled.** Onda tracks the clothes you own, builds outfit options for the
weather and the occasion, stages them on a themeable backdrop, and connects you to a
style-matched community feed where every piece is shoppable.

Built with **Expo (React Native) + Expo Router**, so the same codebase runs on **iOS,
Android and the web**. Backed by **Supabase** (Postgres + Auth + Storage) with a graceful
offline fallback.

---

## ✨ Features

| Area | What works today |
| --- | --- |
| **Onboarding** | Pick from **10 themes** + **16 style types**; the whole app reskins live as you choose. |
| **Themes** | Pink Cute 🎀, Lavender 💜, Light Blue 🩵, Matcha 🍵, Earthy 🌿, Cat 🐈, Rubber Duck 🦆, Mono ⚫, Dark Red 🍷, Emo 🖤 — switchable any time. |
| **Wardrobe** | Add items manually or by **camera scan**, browse by category, edit name / price / source, mark items *sold out* or *wishlist*. New users get a seeded starter closet. |
| **Camera scan** | Snap a garment → it's "recognized" and searched on the web for name, price and where to buy (mocked — see below). You can fix any field before saving. |
| **Outfit generator** | Picks looks from **your real closet**, tuned to **live weather** (Open‑Meteo) + the **occasion** (work, school, date, gym, climbing, party…) + your style profile. Regenerate for more. |
| **Outfit staging** | View a saved outfit on a backdrop — **white / studio black / red carpet / café / garden / sunset** (the foundation for the 3D avatar). |
| **Social feed** | Outfits from people whose style matches yours, ranked by a **match score**. Every item has a **"Shop the look"** list with affiliate‑tagged buy links. |
| **Boards** | Pinterest‑style boards; save looks straight from the feed. |
| **Profile** | Edit your styles & theme, see your stats, cloud/offline status. |

---

## 🧱 Tech & architecture

- **Expo SDK 56 / React Native 0.85 / React 19**, **Expo Router** (file-based routing in `src/app/`).
- **TypeScript** throughout, strict mode, 0 type errors.
- **Supabase**: Postgres schema with Row Level Security, Storage buckets, auto profile creation, and a likes-count trigger.
- **Repository pattern** (`src/data/`): screens depend on a single `Repository` interface with two interchangeable adapters —
  - `supabaseRepo` (cloud, RLS-scoped to the signed-in user), and
  - `localRepo` (AsyncStorage offline fallback).

  The app boots into cloud mode when Supabase auth is available and **degrades gracefully to local** otherwise, so it always runs.
- **Theme system** (`src/theme/`): a `ThemeProvider` exposes design tokens (colors, radii, gradients) consumed by a small set of themed primitives in `src/components/ui/`.

```
src/
  app/                 # Expo Router routes
    _layout.tsx        # providers + root stack
    index.tsx          # loading / onboarding gate
    onboarding.tsx     # theme + style picker
    (tabs)/            # closet · outfits · feed · boards · profile
    item/              # add (modal) + edit
    scan.tsx           # camera scan (modal)
    outfit/[id].tsx    # staged outfit viewer
  components/          # ItemCard, OutfitStage, FeedCard, ThemePicker, ui/…
  data/                # Repository interface + supabase/local adapters + fixtures
  lib/                 # weather, identify (scan), generator, affiliate, colors
  theme/               # themes + provider
  constants/           # style/category/occasion catalog
  types/               # domain models
```

---

## 🚀 Getting started

```bash
npm install

# Web (opens in your browser)
npm run web

# Native (needs the Expo Go app or a simulator)
npm run ios       # macOS only
npm run android
```

The Supabase URL + publishable key ship with sensible defaults in
[`src/lib/config.ts`](src/lib/config.ts); override them via a `.env` file (see
[`.env.example`](.env.example)). The publishable key is safe to expose — the database is
protected by Row Level Security.

### Enabling cloud sync (real multi-user)

The Supabase project is already provisioned (schema, RLS, storage). To turn on cloud
sync + the multi-user backend, enable one toggle in the Supabase dashboard:

> **Authentication → Sign In / Providers → Anonymous sign-ins → ON**

With it off, Onda runs fully in **offline mode** (everything saved on-device). With it on,
every device gets a real Supabase user and data syncs to the cloud. The Profile screen
shows which mode you're in.

---

## 🧪 What's real vs. mocked

- ✅ **Real:** weather (Open‑Meteo, no API key), the outfit generator, theming, all CRUD,
  Supabase schema/RLS/storage, the data layer, the **shared product catalog**, the
  **paste-a-link import** (the `import-product` Edge Function reads any store page's
  title / image / price / availability and adds it to the catalog), and the **monthly
  catalog refresh** (pg_cron → `refresh-catalog`, which flags discontinued items
  `in_stock = false` without ever deleting them).
  - **Reaching bot-blocked retailers:** many big stores (Levi's, Veja, Madewell,
    anything behind Cloudflare) block server-side fetches from datacenter IPs.
    `import-product` works around this with a fallback chain: a direct fetch with
    browser headers (Shopify + most stores) → the **Wayback Machine** archive
    (archive.org does the fetch, so it recovers e.g. Levi's product photos for
    **free**) → an optional rendering proxy for the hardest sites if you set a
    `SCRAPER_API_KEY` secret: `npx supabase secrets set SCRAPER_API_KEY=<key>`
    (e.g. a free ScraperAPI key — renders JS + rotates residential IPs).
- 🟡 **Mocked, with clean swap-in points:**
  - **Camera scan recognition** ([`src/lib/identify.ts`](src/lib/identify.ts)) simulates a
    vision + product-search pipeline. Replace the function body with a real
    image-recognition + retailer-search backend; the UI already consumes the returned shape.
  - **Affiliate links** ([`src/lib/affiliate.ts`](src/lib/affiliate.ts)) append a simple
    `ref=onda` tag — swap for a real affiliate network.
  - **3D avatar** — outfits are currently staged as a flat-lay on selectable backdrops
    ([`OutfitStage`](src/components/OutfitStage.tsx)); this is the seam where a real 3D
    body model would slot in.
  - **Social feed** is seeded with demo users until the community has public outfits.
- 🖼️ **Photos** picked/captured are stored by local URI for now; wiring uploads to the
  existing Supabase Storage buckets is the next step for cross-device images.

---

## 🗺️ Roadmap

- Real garment recognition + product search for the camera scan
- Upload item/outfit photos to Supabase Storage
- True 3D avatar with body measurements & garment draping
- Push-notification "morning outfit" scheduling (work / school / gym)
- "Upgrade my outfit" — photograph your current fit and get add-on recommendations
- Email/social accounts + following graph for the live feed

---

_Made with 🧵_
