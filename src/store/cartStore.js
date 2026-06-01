import { create } from "zustand";

export const useCartStore = create((set, get) => ({
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

  addItem: (product, isSignedIn, navigate) => {
    if (!isSignedIn) {
      navigate("/login");
      return false;
    }
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      });
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
    return true;
  },

  removeItem: (productId) =>
    set({ items: get().items.filter((i) => i.id !== productId) }),

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) return;
    set({
      items: get().items.map((i) =>
        i.id === productId ? { ...i, quantity } : i,
      ),
    });
  },

  clearCart: () => set({ items: [] }),
  getTotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
