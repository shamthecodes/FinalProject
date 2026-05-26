import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product, isSignedIn, navigate) => {
        if (!isSignedIn) {
          navigate("/login");
          return false;
        }
        const items = get().items;
        const exists = items.find((i) => i.id === product.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
        return true;
      },

      isWishlisted: (productId) => get().items.some((i) => i.id === productId),

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.id !== productId) }),

      getCount: () => get().items.length,
    }),
    { name: "jewelsnow-wishlist" },
  ),
);
