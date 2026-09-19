import { create } from "zustand";

interface ProductFilterState {
  category: string | null;
  setCategory: (category: string) => void;
  clear: () => void;
}

export const useProductFilterStore = create<ProductFilterState>((set) => ({
  category: null,
  setCategory: (category) => set({ category }),
  clear: () => set({ category: null }),
}));
