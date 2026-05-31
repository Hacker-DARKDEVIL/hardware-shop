"use client";

import { useProductsStore } from "@/store/products";
import { ProductCard } from "@/components/ui/ProductCard";

export function FeaturedProducts() {
  const { products } = useProductsStore();
  const featured = products.slice(0, 6);

  return (
    <section id="products" className="px-10 pb-24">
      <div className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
        <span className="block w-6 h-px bg-[color:var(--accent)]" />
        Featured Hardware
      </div>
      <h2 className="font-sans font-extrabold text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-tight mb-3">
        Our picks<br />this week.
      </h2>
      <p className="font-mono text-[0.68rem] leading-[1.9] tracking-[0.04em] text-[color:var(--muted)] max-w-[48ch] mb-14">
        Curated by engineers, for engineers. No marketing noise — just specs that matter.
      </p>

      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          background: "var(--border2)",
        }}
      >
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
