# ChipForge — Hardware Store

A cinematic Next.js 15 hardware store for ESP32, STM32, Arduino, Raspberry Pi,
and more. Dark HUD aesthetic with scroll-driven canvas animation, cart, and
MCU comparison table.

## Tech Stack

| Layer       | Choice                          |
|-------------|---------------------------------|
| Framework   | Next.js 15 (App Router)         |
| Styling     | Tailwind CSS v4                 |
| Fonts       | Syne (headings) + Space Mono    |
| Cart State  | Zustand (persisted localStorage)|
| Language    | TypeScript                      |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Design tokens, animations
│   ├── layout.tsx        # Root layout + fonts
│   └── page.tsx          # Home page
│
├── components/
│   ├── ui/
│   │   ├── Navbar.tsx        # Fixed nav with live cart count
│   │   ├── CartDrawer.tsx    # Slide-in cart panel
│   │   ├── ProductCard.tsx   # Product card with add-to-cart
│   │   ├── HudFrame.tsx      # HUD corner bracket SVG
│   │   └── EyebrowBadge.tsx  # Pill badge with pulse dot
│   │
│   └── sections/
│       ├── Hero.tsx              # Scroll-driven canvas chip animation
│       ├── Ticker.tsx            # Marquee stock ticker
│       ├── Categories.tsx        # Category browse grid
│       ├── FeaturedProducts.tsx  # Product grid
│       ├── ComparisonTable.tsx   # MCU spec comparison
│       ├── NewsletterCta.tsx     # Email signup
│       └── Footer.tsx
│
├── lib/
│   └── data.ts           # Products, categories, comparison rows
│
└── store/
    └── cart.ts           # Zustand cart store
```

## Adding Real Products

Edit `src/lib/data.ts` — swap `PRODUCTS` array with your catalog.
Each product needs:

```ts
{
  id: string;          // unique slug
  name: string;
  brand: string;
  brandColor: string;  // hex, used for chip badge
  category: string;    // matches CATEGORIES[].id
  price: number;       // in INR, excluding GST label
  inStock: boolean;
  badge?: "new" | "popular" | "sale";
  description: string;
  specs: { key: string; value: string }[];
}
```

## Connecting a Backend

Replace the static `PRODUCTS` array in `FeaturedProducts.tsx` with an async
fetch — Next.js Server Components make this a one-liner:

```ts
// src/components/sections/FeaturedProducts.tsx
const products = await fetch("https://your-api.com/products").then(r => r.json());
```

For a quick backend, consider:
- **Supabase** — Postgres + REST + realtime stock updates
- **Medusa.js** — open-source commerce engine
- **Shopify Storefront API** — if you're already on Shopify

## Customising the Hero

The Hero uses a canvas-drawn animated IC chip. To replace it with real product
photos (like the Iron Man frame-scrubbing technique):

1. Export your product video as JPEG frames (e.g. with ffmpeg)
2. Put frames in `public/frames/frame_0001.jpg` etc.
3. Replace the `drawChipFrame` canvas logic in `Hero.tsx` with the
   image-preloading + `ctx.drawImage` pattern from the source Iron Man project.

## Deployment

```bash
npm run build
```

Deploy to Vercel, Railway, or any Node-compatible host.
