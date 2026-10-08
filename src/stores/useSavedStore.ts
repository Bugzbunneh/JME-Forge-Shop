import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedState {
  ids: string[];
  toggleSaved: (productId: string) => void;
  clearSaved: () => void;
}

// skipHydration keeps the first client render identical to the prerendered HTML;
// App rehydrates from localStorage after mount.
export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      ids: [],
      toggleSaved: (productId) =>
        set((state) => {
          const isSaved = state.ids.includes(productId);
          const ids = isSaved
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId];
          return { ids };
        }),
      clearSaved: () => set({ ids: [] }),
    }),
    { name: "jme-saved-products", skipHydration: true },
  ),
);
