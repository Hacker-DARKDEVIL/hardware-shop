<div align="center">

# ⚡ ChipForge

**A full-stack electronics e-commerce storefront built with Next.js 15**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)

A dark-themed, HUD-aesthetic storefront for embedded hardware — microcontrollers, wireless modules, sensors, and dev tools. Ships with a live admin dashboard, cart, wishlist, auth, and checkout.

</div>

---

## ✨ Features

### 🛒 Storefront
- **Product catalog** with search, category filters, stock filter, and sort
- **Product detail pages** with specs table, star ratings, and customer reviews
- **MCU comparison table** — side-by-side spec comparison for top boards
- **Live cart drawer** with quantity controls and order total
- **Wishlist** — save products across sessions
- **Ticker** — scrolling live stock/price feed in the navbar

### 🔐 Authentication
- Sign up / log in with persistent sessions via Zustand + localStorage
- Protected routes — cart and checkout require auth
- Account page with order history and tracking IDs

### 🛠️ Admin Panel
- Protected at `/admin` — separate credential system from customer auth
- **Full CRUD** — add, edit, delete products live
- **Product image URL** field with live preview thumbnail
- Changes reflect instantly across the entire storefront (shared Zustand store)
- Analytics tab — category breakdown, price distribution, stock fill rate

### 🎨 Design
- Dark HUD aesthetic with cyan + violet accent system
- CSS custom properties for full theme consistency
- Grain overlay, backdrop blur card surfaces, animated pulse dots
- Monospace + display type pairing (Space Mono + Syne)
- Fully responsive — mobile-first layout

---

## 🗂️ Project Structure

```
chipforge/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx          # Product catalog
│   │   │   └── [id]/page.tsx     # Product detail
│   │   ├── admin/
│   │   │   ├── page.tsx          # Admin dashboard
│   │   │   └── login/page.tsx    # Admin login
│   │   ├── auth/page.tsx         # Customer login / signup
│   │   ├── checkout/page.tsx     # Checkout flow
│   │   ├── account/page.tsx      # Order history
│   │   ├── layout.tsx
│   │   └── globals.css           # Design tokens + base styles
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Ticker.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   ├── NewsletterCta.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── Navbar.tsx
│   │       ├── ProductCard.tsx
│   │       ├── CartDrawer.tsx
│   │       ├── HudFrame.tsx
│   │       └── EyebrowBadge.tsx
│   ├── store/
│   │   ├── products.ts           # ⭐ Shared product store (admin ↔ storefront)
│   │   ├── cart.ts
│   │   ├── wishlist.ts
│   │   ├── auth.ts
│   │   └── adminAuth.ts
│   └── lib/
│       └── data.ts               # Seed data — products, categories, reviews
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/chipforge.git
cd chipforge

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials

### Customer Login
| Field | Value |
|-------|-------|
| Email | `arjun@example.com` |
| Password | `password123` |

> You can also sign up with any email — new accounts are persisted in localStorage.

### Admin Panel
Navigate to `/admin/login`

| Field | Value |
|-------|-------|
| Username | `admin@chipforge.dev` |
| Password | `ChipForge@Admin2025` |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| State | [Zustand 5](https://github.com/pmndrs/zustand) with `persist` middleware |
| Fonts | Space Mono + Syne via `next/font` |

---

## 🏗️ Architecture Notes

### State Management
All global state lives in Zustand stores under `src/store/`. Each store uses the `persist` middleware to survive page refreshes via localStorage.

The key design decision: **the admin panel and storefront share the same `useProductsStore`**. When an admin edits a product, the change propagates instantly to every page that reads from the store — no API calls, no manual refresh.

```
Admin Panel  ──writes──▶  useProductsStore  ──reads──▶  Storefront Pages
                              (persisted)
```

### Routing
Uses Next.js App Router with file-based routing. Admin routes guard themselves with a `useEffect` redirect if `isAdminAuthenticated` is false.

### Data
Product, category, and review seed data lives in `src/lib/data.ts`. The products store is initialized with this seed data on first load, then mutations are persisted to localStorage.

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🗺️ Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Homepage — Hero, ticker, categories, featured products, comparison table |
| `/products` | Full catalog with search, filter, sort |
| `/products/[id]` | Product detail with specs, reviews, add to cart |
| `/auth` | Customer login / signup |
| `/checkout` | Cart review and order placement |
| `/account` | Order history (requires auth) |
| `/admin/login` | Admin authentication |
| `/admin` | Store dashboard — products CRUD + analytics |

---

## 🎨 Design Tokens

The entire color system is defined in `globals.css` as CSS custom properties:

```css
--bg:        #07080a    /* page background */
--bg2:       #0e1015    /* card / surface background */
--fg:        #e8eaf0    /* primary text */
--muted:     #6b7280    /* secondary text */
--accent:    #00d4ff    /* cyan — prices, highlights */
--accent2:   #7c3aed    /* violet — admin, CTAs */
--danger:    #ff3d6b    /* errors, out of stock */
--success:   #22c55e    /* in stock, confirmations */
```

---

## 📄 License

© 2025 JEEVASH.D. All rights reserved

---

<div align="center">

Built with ⚡ by the ChipForge team

</div>
