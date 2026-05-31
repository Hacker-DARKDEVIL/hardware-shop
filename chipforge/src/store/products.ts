import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS as INITIAL_PRODUCTS } from "@/lib/data";
import type { Product } from "@/lib/data";

interface ProductsStore {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, data: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
}

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set) => ({
      products: INITIAL_PRODUCTS,

      addProduct: (data) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...data, id: `product_${Date.now()}` },
          ],
        })),

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      resetProducts: () => set({ products: INITIAL_PRODUCTS }),
    }),
    { name: "chipforge-products" }
  )
);
