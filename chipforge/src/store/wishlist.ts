import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";

interface WishlistStore {
  items: Product[];
  toggle: (product: Product) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((p) => p.id === product.id);
        if (exists) {
          set({ items: get().items.filter((p) => p.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      has: (id) => get().items.some((p) => p.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: "chipforge-wishlist" }
  )
);
