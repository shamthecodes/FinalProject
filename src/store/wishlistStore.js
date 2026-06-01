import { create } from "zustand";

export const useWishlistStore = create((set, get) => ({
  items: [],
  userId: null,
  hydrated: false, // ← NEW

  setUser: (newUserId) => {
    if (get().userId !== newUserId) {
      set({ items: [], userId: newUserId, hydrated: false });
    }
  },

  clearForLogout: () => set({ items: [], userId: null, hydrated: false }),

  setHydrated: () => set({ hydrated: true }), // ← NEW

  toggleWishlist: (product, isSignedIn, navigate, user) => {
    const SERVER = "http://localhost:3001";
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
      // Trigger wishlist reminder email
      if (user?.primaryEmailAddress?.emailAddress) {
        fetch(`${SERVER}/api/trigger/wishlist-added`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.primaryEmailAddress.emailAddress,
            customerName: user.firstName || "Customer",
            productName: product.name,
            productId: product.id,
          }),
        }).catch(console.error);
      }
    }
    return true;
  },

  isWishlisted: (productId) => get().items.some((i) => i.id === productId),
  removeItem: (productId) =>
    set({ items: get().items.filter((i) => i.id !== productId) }),
  getCount: () => get().items.length,
}));
