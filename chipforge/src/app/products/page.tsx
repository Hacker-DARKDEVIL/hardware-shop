"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { CATEGORIES } from "@/lib/data";
import { useProductsStore } from "@/store/products";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";

const SORT_OPTIONS = [
  { value: "name_asc",   label: "Name A–Z" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <svg key={s} width="10" height="10" viewBox="0 0 12 12" fill={s <= Math.round(rating) ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="1.5">
            <polygon points="6,1 7.5,4.5 11,4.8 8.5,7.2 9.2,11 6,9.2 2.8,11 3.5,7.2 1,4.8 4.5,4.5"/>
          </svg>
        ))}
      </div>
      {count !== undefined && (
        <span className="font-mono text-[0.52rem] text-[color:var(--muted)]">({count})</span>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("name_asc");
  const [inStockOnly, setInStockOnly] = useState(false);
  const { products: PRODUCTS } = useProductsStore();
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.includes(q))
      );
    }
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, category, sort, inStockOnly, PRODUCTS]);

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-[60px]">
        {/* Header */}
        <section className="relative border-b border-[color:var(--border2)] px-6 md:px-10 py-10 hud-grid overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-3">
              <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]" />
              Store · {PRODUCTS.length} SKUs
            </div>
            <h1 className="font-sans font-extrabold text-3xl md:text-4xl tracking-tight mb-1">
              Product Catalog
            </h1>
            <p className="font-mono text-[0.65rem] text-[color:var(--muted)] tracking-[0.08em]">
              Microcontrollers, wireless modules, sensors & more — shipped across India
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full md:w-56 shrink-0 space-y-6">
            <div>
              <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--muted)] mb-3">Category</div>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory("all")}
                  className={`w-full text-left font-mono text-[0.6rem] uppercase tracking-[0.14em] px-3 py-2 rounded-sm transition-colors ${category === "all" ? "bg-[color:var(--accent-dim)] text-[color:var(--accent)] border border-[color:var(--border)]" : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"}`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`w-full text-left font-mono text-[0.6rem] uppercase tracking-[0.14em] px-3 py-2 rounded-sm transition-colors flex items-center justify-between ${category === c.id ? "bg-[color:var(--accent-dim)] text-[color:var(--accent)] border border-[color:var(--border)]" : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"}`}
                  >
                    <span>{c.icon} {c.name}</span>
                    <span className="text-[0.5rem] opacity-50">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-[color:var(--border2)] pt-5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${inStockOnly ? "bg-[color:var(--accent)] border-[color:var(--accent)]" : "border-[color:var(--border)] group-hover:border-[color:var(--accent)]"}`}
                >
                  {inStockOnly && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4L3.5 6L6.5 2" stroke="black" strokeWidth="1.5" fill="none"/></svg>}
                </div>
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search + sort bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search products, brands, tags…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[color:var(--bg2)] border border-[color:var(--border2)] text-[color:var(--fg)] font-mono text-[0.65rem] tracking-[0.06em] pl-9 pr-4 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--muted)]"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-[color:var(--bg2)] border border-[color:var(--border2)] text-[color:var(--fg)] font-mono text-[0.62rem] uppercase tracking-[0.12em] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent)] transition-colors"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[color:var(--muted)] mb-4">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 border border-[color:var(--border2)] rounded-sm">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">No products found</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[color:var(--border2)]">
                {filtered.map((product) => (
                  <article key={product.id} className="group relative bg-[color:var(--bg)] p-6 transition-colors hover:bg-[color:var(--bg2)]">
                    {/* Wishlist button */}
                    <button
                      onClick={() => toggle(product)}
                      className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Toggle wishlist"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={has(product.id) ? "var(--danger)" : "none"} stroke={has(product.id) ? "var(--danger)" : "var(--muted)"} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>

                    {/* Brand */}
                    {product.image && (
                      <div className="w-full h-32 mb-4 rounded-sm overflow-hidden bg-white flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain p-2"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                        />
                      </div>
                    )}
                    <div className="inline-flex items-center gap-1.5 font-mono text-[0.52rem] uppercase tracking-[0.2em] border px-2 py-1 rounded-sm mb-4"
                      style={{ color: product.brandColor, borderColor: `${product.brandColor}33` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: product.brandColor }} />
                      {product.brand}
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <h2 className="font-sans font-bold text-[1.05rem] tracking-tight leading-tight mb-2 hover:text-[color:var(--accent)] transition-colors">
                        {product.name}
                      </h2>
                    </Link>

                    <p className="font-mono text-[0.58rem] leading-[1.8] text-[color:var(--muted)] mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {product.rating && <div className="mb-4"><StarRating rating={product.rating} count={product.reviewCount} /></div>}

                    {/* Tags */}
                    {product.tags && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map((t) => (
                          <span key={t} className="font-mono text-[0.48rem] uppercase tracking-[0.14em] border border-[color:var(--border2)] text-[color:var(--muted)] px-1.5 py-0.5 rounded-sm">{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-[color:var(--border2)]">
                      <div>
                        <div className="font-sans font-bold text-[1.2rem]" style={{ color: product.inStock ? "var(--accent)" : "var(--muted)" }}>
                          ₹{product.price.toLocaleString("en-IN")}
                        </div>
                        <div className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                          {product.inStock ? "In stock" : "Out of stock"}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!user) { router.push("/auth?redirect=/products"); return; }
                          addItem(product);
                        }}
                        disabled={!product.inStock}
                        className={`font-mono text-[0.55rem] uppercase tracking-[0.15em] px-3 py-2 rounded-sm border transition-all ${product.inStock ? "bg-[color:var(--accent-dim)] border-[color:var(--border)] text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-black" : "opacity-30 cursor-not-allowed border-[color:var(--border2)] text-[color:var(--muted)]"}`}
                      >
                        Add
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
