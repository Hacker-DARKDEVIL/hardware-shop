"use client";

import { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { HudFrame } from "@/components/ui/HudFrame";
import { REVIEWS } from "@/lib/data";
import { useProductsStore } from "@/store/products";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((s) => (
        <svg
          key={s}
          width="14" height="14" viewBox="0 0 12 12"
          fill={(interactive ? (hover || rating) : rating) >= s ? "var(--accent)" : "none"}
          stroke="var(--accent)" strokeWidth="1.2"
          className={interactive ? "cursor-pointer" : ""}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(s)}
        >
          <polygon points="6,1 7.5,4.5 11,4.8 8.5,7.2 9.2,11 6,9.2 2.8,11 3.5,7.2 1,4.8 4.5,4.5"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProductsStore();
  const product = products.find((p) => p.id === id);
  if (!product) return notFound();

  const reviews = REVIEWS.filter((r) => r.productId === id);
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", body: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleAdd = () => {
    if (!user) {
      router.push(`/auth?redirect=/products/${id}`);
      return;
    }
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating || 0;

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-[60px]">
        {/* Breadcrumb */}
        <div className="border-b border-[color:var(--border2)] px-6 md:px-10 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
            <Link href="/" className="hover:text-[color:var(--accent)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[color:var(--accent)] transition-colors">Products</Link>
            <span>/</span>
            <span className="text-[color:var(--fg)]">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left: visual */}
            <div className="relative">
              <div className="relative card-surface aspect-square flex items-center justify-center overflow-hidden">
                <HudFrame corner="tl" className="absolute top-3 left-3 text-[color:var(--accent)] opacity-40" />
                <HudFrame corner="tr" className="absolute top-3 right-3 text-[color:var(--accent)] opacity-40" />
                <HudFrame corner="bl" className="absolute bottom-3 left-3 text-[color:var(--accent)] opacity-40" />
                <HudFrame corner="br" className="absolute bottom-3 right-3 text-[color:var(--accent)] opacity-40" />
                <div className="hud-grid absolute inset-0" />
                <div className="relative z-10 text-center p-6 w-full h-full flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-[280px] max-w-full object-contain bg-white rounded-sm p-4"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = "none";
                        el.nextElementSibling?.removeAttribute("style");
                      }}
                    />
                  ) : null}
                  <div className="text-center" style={{ display: product.image ? "none" : "block" }}>
                    <div className="font-mono text-[4rem] opacity-20 mb-4">⚡</div>
                    <div className="font-sans font-extrabold text-2xl tracking-tight" style={{ color: product.brandColor }}>
                      {product.name}
                    </div>
                    <div className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[color:var(--muted)] mt-2">
                      {product.brand}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: info */}
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-[0.52rem] uppercase tracking-[0.2em] border px-2.5 py-1 rounded-sm mb-5"
                style={{ color: product.brandColor, borderColor: `${product.brandColor}33` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: product.brandColor }} />
                {product.brand}
              </div>

              <h1 className="font-sans font-extrabold text-3xl tracking-tight mb-3">{product.name}</h1>

              {/* Rating summary */}
              <div className="flex items-center gap-3 mb-5">
                <StarRating rating={avgRating} />
                <span className="font-mono text-[0.6rem] text-[color:var(--muted)]">
                  {avgRating.toFixed(1)} · {reviews.length || product.reviewCount || 0} reviews
                </span>
              </div>

              <p className="font-mono text-[0.65rem] leading-[1.9] tracking-[0.04em] text-[color:var(--muted)] mb-6">
                {product.description}
              </p>

              {/* Specs */}
              <div className="card-surface p-5 mb-6">
                <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-3">Specifications</div>
                <div className="space-y-2">
                  {product.specs.map((s) => (
                    <div key={s.key} className="flex justify-between font-mono text-[0.6rem] tracking-[0.08em] py-1.5 border-b border-[color:var(--border2)] last:border-0">
                      <span className="uppercase text-[color:var(--muted)]">{s.key}</span>
                      <span className="text-[color:var(--fg)]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {product.tags && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {product.tags.map((t) => (
                    <span key={t} className="font-mono text-[0.5rem] uppercase tracking-[0.14em] border border-[color:var(--border2)] text-[color:var(--muted)] px-2 py-1 rounded-sm">{t}</span>
                  ))}
                </div>
              )}

              {/* Price + actions */}
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="font-sans font-extrabold text-3xl" style={{ color: product.inStock ? "var(--accent)" : "var(--muted)" }}>
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>
                  {product.originalPrice && (
                    <div className="font-mono text-[0.6rem] text-[color:var(--muted)] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</div>
                  )}
                  <div className="font-mono text-[0.52rem] uppercase tracking-[0.18em] mt-1" style={{ color: product.inStock ? "var(--success)" : "var(--danger)" }}>
                    {product.inStock ? "● In Stock" : "● Out of Stock"}
                  </div>
                </div>
                {/* Qty */}
                <div className="flex items-center border border-[color:var(--border2)] rounded-sm overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 font-mono text-[color:var(--muted)] hover:text-[color:var(--fg)] hover:bg-[color:var(--bg2)] transition-colors">−</button>
                  <span className="w-10 text-center font-mono text-[0.65rem]">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-8 h-8 font-mono text-[color:var(--muted)] hover:text-[color:var(--fg)] hover:bg-[color:var(--bg2)] transition-colors">+</button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock || added}
                  className={`flex-1 font-mono text-[0.62rem] uppercase tracking-[0.15em] py-3 rounded-sm border transition-all ${added ? "bg-[rgba(34,197,94,0.15)] border-[rgba(34,197,94,0.4)] text-[color:var(--success)]" : product.inStock ? "bg-[color:var(--accent)] text-black border-[color:var(--accent)] hover:opacity-85" : "opacity-30 cursor-not-allowed border-[color:var(--border2)] text-[color:var(--muted)]"}`}
                >
                  {added ? "Added to Cart ✓" : "Add to Cart"}
                </button>
                <button
                  onClick={() => toggle(product)}
                  className="w-12 flex items-center justify-center border border-[color:var(--border2)] rounded-sm hover:border-[color:var(--danger)] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={has(product.id) ? "var(--danger)" : "none"} stroke={has(product.id) ? "var(--danger)" : "var(--muted)"} strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div className="border-t border-[color:var(--border2)] pt-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-1">Customer Reviews</div>
                <div className="flex items-center gap-3">
                  <span className="font-sans font-extrabold text-4xl">{avgRating.toFixed(1)}</span>
                  <div>
                    <StarRating rating={avgRating} />
                    <div className="font-mono text-[0.55rem] text-[color:var(--muted)] mt-1">{reviews.length} reviews</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="font-mono text-[0.6rem] uppercase tracking-[0.15em] border border-[color:var(--border)] text-[color:var(--accent)] px-4 py-2 rounded-sm hover:bg-[color:var(--accent-dim)] transition-colors"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            </div>

            {/* Review form */}
            {showReviewForm && !submitted && (
              <div className="card-surface p-6 mb-8">
                <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--muted)] mb-4">Your Rating</div>
                <StarRating rating={newReview.rating} interactive onRate={(r) => setNewReview((p) => ({ ...p, rating: r }))} />
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Review title…"
                    value={newReview.title}
                    onChange={(e) => setNewReview((p) => ({ ...p, title: e.target.value }))}
                    className="w-full bg-[color:var(--bg)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)]"
                  />
                  <textarea
                    placeholder="Share your experience with this product…"
                    rows={4}
                    value={newReview.body}
                    onChange={(e) => setNewReview((p) => ({ ...p, body: e.target.value }))}
                    className="w-full bg-[color:var(--bg)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--muted)] text-[color:var(--fg)] resize-none"
                  />
                  <button
                    onClick={() => setSubmitted(true)}
                    disabled={!newReview.title || !newReview.body}
                    className="font-mono text-[0.6rem] uppercase tracking-[0.15em] bg-[color:var(--accent)] text-black px-5 py-2 rounded-sm disabled:opacity-40 hover:opacity-85 transition-opacity"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}
            {submitted && (
              <div className="card-surface p-4 mb-8 border-[rgba(34,197,94,0.3)]">
                <span className="font-mono text-[0.6rem] text-[color:var(--success)] uppercase tracking-[0.18em]">✓ Review submitted — thank you!</span>
              </div>
            )}

            {/* Review list */}
            <div className="space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-[color:var(--border2)] pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans font-bold text-[0.85rem]">{r.author}</span>
                        {r.verified && <span className="font-mono text-[0.48rem] uppercase tracking-[0.18em] text-[color:var(--success)] border border-[rgba(34,197,94,0.3)] px-1.5 py-0.5 rounded-sm">Verified</span>}
                      </div>
                      <StarRating rating={r.rating} />
                    </div>
                    <span className="font-mono text-[0.52rem] text-[color:var(--muted)]">{r.date}</span>
                  </div>
                  <div className="font-sans font-semibold text-[0.9rem] mb-1">{r.title}</div>
                  <p className="font-mono text-[0.62rem] leading-[1.9] text-[color:var(--muted)]">{r.body}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-10">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">No reviews yet — be the first!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
