"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/data";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!user) {
      router.push("/auth?redirect=/products");
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const badgeLabel =
    product.badge === "new"     ? "New"     :
    product.badge === "popular" ? "Popular" :
    product.badge === "sale"    ? "Sale"    : null;

  const badgeColor =
    product.badge === "new"     ? "bg-[color:var(--accent)] text-black"        :
    product.badge === "popular" ? "bg-[color:var(--danger)] text-white"         :
    product.badge === "sale"    ? "bg-[color:var(--success)] text-black"        : "";

  return (
    <article className="group relative bg-[color:var(--bg2)] p-8 transition-colors duration-200 hover:bg-[rgba(14,16,21,0.6)] overflow-hidden cursor-default">
      {/* Radial hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            `radial-gradient(circle at 50% 50%, rgba(0,212,255,0.055), transparent 65%)`,
        }}
      />

      {/* Badge */}
      {badgeLabel && (
        <span
          className={`absolute top-6 right-6 font-mono text-[0.5rem] uppercase tracking-[0.2em] px-2 py-1 rounded-sm font-bold z-10 ${badgeColor}`}
        >
          {badgeLabel}
        </span>
      )}

      {/* Product image */}
      {product.image && (
        <div className="w-full h-40 mb-5 rounded-sm overflow-hidden bg-white flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain p-2"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
          />
        </div>
      )}

      {/* Brand chip */}
      <div
        className="inline-flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] border px-2.5 py-1 rounded-sm mb-5"
        style={{
          color: product.brandColor,
          borderColor: `${product.brandColor}33`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: product.brandColor }}
        />
        {product.brand}
      </div>

      {/* Name */}
      <h3 className="font-sans font-bold text-[1.2rem] tracking-tight leading-tight mb-3">
        {product.name}
      </h3>

      {/* Description */}
      <p className="font-mono text-[0.62rem] leading-[1.85] tracking-[0.04em] text-[color:var(--muted)] mb-5">
        {product.description}
      </p>

      {/* Specs */}
      <div className="space-y-1.5 mb-6">
        {product.specs.map((s) => (
          <div
            key={s.key}
            className="flex justify-between items-center font-mono text-[0.58rem] tracking-[0.1em] py-1.5 border-b border-[color:var(--border2)]"
          >
            <span className="uppercase text-[color:var(--muted)]">{s.key}</span>
            <span className="text-[color:var(--fg)]">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-sans font-bold text-[1.4rem] leading-none"
            style={{ color: product.inStock ? "var(--accent)" : "var(--muted)" }}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </div>
          <div className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-[color:var(--muted)] mt-1">
            {product.inStock ? "In stock · per unit" : "Out of stock"}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.inStock || added}
          className={`font-mono text-[0.58rem] uppercase tracking-[0.15em] px-4 py-2.5 rounded-sm border transition-all duration-200 ${
            added
              ? "bg-[rgba(34,197,94,0.15)] border-[rgba(34,197,94,0.4)] text-[color:var(--success)]"
              : product.inStock
              ? "bg-[color:var(--accent-dim)] border-[color:var(--border)] text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-black"
              : "opacity-30 cursor-not-allowed border-[color:var(--border2)] text-[color:var(--muted)]"
          }`}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
