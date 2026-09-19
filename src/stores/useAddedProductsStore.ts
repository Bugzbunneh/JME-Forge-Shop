import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";

interface AddedProductsState {
  products: Product[];
  addProduct: (product: Product) => void;
}

export const useAddedProductsStore = create<AddedProductsState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
    }),
    { name: "jme-forge-added-products" },
  ),
);
