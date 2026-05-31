"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, clearCart } =
    useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[201] h-full w-[360px] max-w-full bg-[var(--bg2)] border-l border-[color:var(--border2)] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border2)]">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[color:var(--accent)]">
            Cart // {items.length} items
          </span>
          <button
            onClick={closeCart}
            className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
          >
            Close ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <span className="text-4xl opacity-20">🛒</span>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Your cart is empty
              </p>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div
                key={product.id}
                className="card-surface p-4 flex gap-4 items-start"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-bold text-sm truncate">
                    {product.name}
                  </p>
                  <p
                    className="font-mono text-[0.58rem] uppercase tracking-[0.15em] mt-0.5"
                    style={{ color: product.brandColor }}
                  >
                    {product.brand}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQty(product.id, qty - 1)}
                      className="w-6 h-6 rounded border border-[color:var(--border2)] text-[color:var(--muted)] text-xs hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
                    >
                      −
                    </button>
                    <span className="font-mono text-xs w-4 text-center">{qty}</span>
                    <button
                      onClick={() => updateQty(product.id, qty + 1)}
                      className="w-6 h-6 rounded border border-[color:var(--border2)] text-[color:var(--muted)] text-xs hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="ml-auto font-mono text-[0.55rem] uppercase tracking-[0.15em] text-[color:var(--muted)] hover:text-[color:var(--danger)] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-sans font-bold text-[color:var(--accent)]">
                    ₹{(product.price * qty).toLocaleString("en-IN")}
                  </p>
                  <p className="font-mono text-[0.55rem] text-[color:var(--muted)] mt-0.5">
                    ₹{product.price} each
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[color:var(--border2)] space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Subtotal
              </span>
              <span className="font-sans font-bold text-xl text-[color:var(--accent)]">
                ₹{total().toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={() => {
                closeCart();
                if (!user) { router.push("/auth?redirect=/checkout"); return; }
                router.push("/checkout");
              }}
              className="block w-full bg-[color:var(--accent)] text-black font-mono text-[0.65rem] uppercase tracking-[0.2em] font-bold py-3 rounded-sm hover:opacity-85 transition-opacity text-center"
            >
              Checkout →
            </button>
            <button
              onClick={clearCart}
              className="w-full font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
