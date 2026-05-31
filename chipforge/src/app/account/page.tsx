"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { useAuthStore } from "@/store/auth";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";

const STATUS_COLOR: Record<string, string> = {
  processing: "text-[color:var(--accent)] border-[color:var(--border)]",
  shipped:    "text-yellow-400 border-yellow-400/30",
  delivered:  "text-[color:var(--success)] border-[rgba(34,197,94,0.3)]",
  cancelled:  "text-[color:var(--danger)] border-[rgba(255,61,107,0.3)]",
};

type Tab = "orders" | "wishlist" | "settings";

export default function AccountPage() {
  const { user, orders, logout } = useAuthStore();
  const { items: wishlistItems, toggle } = useWishlistStore();
  const { addItem } = useCartStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => {
    if (!user) router.push("/auth");
  }, [user, router]);

  if (!user) return null;

  const TABS: { id: Tab; label: string }[] = [
    { id: "orders",   label: "Order History" },
    { id: "wishlist", label: `Wishlist (${wishlistItems.length})` },
    { id: "settings", label: "Settings" },
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-[60px]">
        {/* Header */}
        <section className="border-b border-[color:var(--border2)] px-6 md:px-10 py-8 hud-grid">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-1 flex items-center gap-1.5">
                <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]" />
                Account Portal
              </div>
              <h1 className="font-sans font-extrabold text-2xl tracking-tight">{user.name}</h1>
              <div className="font-mono text-[0.6rem] text-[color:var(--muted)] mt-0.5">{user.email}</div>
            </div>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="font-mono text-[0.58rem] uppercase tracking-[0.18em] border border-[color:var(--border2)] text-[color:var(--muted)] px-4 py-2 rounded-sm hover:border-[color:var(--danger)] hover:text-[color:var(--danger)] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
          {/* Tabs */}
          <div className="flex gap-0 border-b border-[color:var(--border2)] mb-8">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`font-mono text-[0.58rem] uppercase tracking-[0.18em] px-5 py-3 border-b-2 transition-colors ${tab === t.id ? "border-[color:var(--accent)] text-[color:var(--accent)]" : "border-transparent text-[color:var(--muted)] hover:text-[color:var(--fg)]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Orders */}
          {tab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 border border-[color:var(--border2)] rounded-sm">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">No orders yet</p>
                  <Link href="/products" className="inline-block mt-4 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[color:var(--accent)] hover:underline">Browse Products →</Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="card-surface p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-sans font-bold text-[1rem]">Order #{order.id}</div>
                        <div className="font-mono text-[0.55rem] text-[color:var(--muted)] mt-0.5">{order.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-[0.52rem] uppercase tracking-[0.18em] border px-2 py-1 rounded-sm ${STATUS_COLOR[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="font-sans font-bold text-[color:var(--accent)]">₹{order.total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between font-mono text-[0.6rem] tracking-[0.06em]">
                          <span className="text-[color:var(--muted)]">{item.name} × {item.qty}</span>
                          <span className="text-[color:var(--fg)]">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                    {order.trackingId && (
                      <div className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[color:var(--muted)] pt-3 border-t border-[color:var(--border2)]">
                        Tracking: <span className="text-[color:var(--accent)]">{order.trackingId}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist */}
          {tab === "wishlist" && (
            <div>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-16 border border-[color:var(--border2)] rounded-sm">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">Your wishlist is empty</p>
                  <Link href="/products" className="inline-block mt-4 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[color:var(--accent)] hover:underline">Browse Products →</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--border2)]">
                  {wishlistItems.map((product) => (
                    <div key={product.id} className="bg-[color:var(--bg)] p-5 group">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[0.52rem] uppercase tracking-[0.2em] border px-2 py-1 rounded-sm mb-3"
                        style={{ color: product.brandColor, borderColor: `${product.brandColor}33` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: product.brandColor }} />
                        {product.brand}
                      </div>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-sans font-bold text-[0.95rem] mb-1 hover:text-[color:var(--accent)] transition-colors">{product.name}</h3>
                      </Link>
                      <p className="font-mono text-[0.58rem] text-[color:var(--muted)] leading-[1.8] mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-bold text-[1.1rem] text-[color:var(--accent)]">₹{product.price.toLocaleString("en-IN")}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addItem(product)}
                            disabled={!product.inStock}
                            className="font-mono text-[0.55rem] uppercase tracking-[0.14em] border border-[color:var(--border)] text-[color:var(--accent)] px-3 py-1.5 rounded-sm hover:bg-[color:var(--accent-dim)] disabled:opacity-30 transition-colors"
                          >
                            Add to Cart
                          </button>
                          <button onClick={() => toggle(product)} className="font-mono text-[0.55rem] uppercase tracking-[0.14em] border border-[color:var(--border2)] text-[color:var(--muted)] px-3 py-1.5 rounded-sm hover:border-[color:var(--danger)] hover:text-[color:var(--danger)] transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {tab === "settings" && (
            <div className="max-w-md space-y-6">
              <div className="card-surface p-6">
                <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-4">Profile</div>
                <div className="space-y-3">
                  {[
                    { label: "Full Name", value: user.name },
                    { label: "Email",     value: user.email },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[color:var(--muted)] block mb-1">{f.label}</label>
                      <input
                        defaultValue={f.value}
                        className="w-full bg-[color:var(--bg)] border border-[color:var(--border2)] font-mono text-[0.65rem] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[color:var(--accent)] transition-colors text-[color:var(--fg)]"
                      />
                    </div>
                  ))}
                  <button className="font-mono text-[0.6rem] uppercase tracking-[0.15em] bg-[color:var(--accent)] text-black px-5 py-2 rounded-sm hover:opacity-85 transition-opacity mt-2">
                    Save Changes
                  </button>
                </div>
              </div>
              <div className="card-surface p-6">
                <div className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--accent)] mb-4">Notifications</div>
                {["Order updates", "New product alerts", "Price drop alerts"].map((label) => (
                  <label key={label} className="flex items-center justify-between py-2 border-b border-[color:var(--border2)] last:border-0 cursor-pointer group">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[color:var(--muted)] group-hover:text-[color:var(--fg)] transition-colors">{label}</span>
                    <div className="w-8 h-4 bg-[color:var(--accent)] rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-black" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
