import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

const useUserSync = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();

  // Step 1: On login, load data from Supabase → set hydrated when done
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      cartStore.clearForLogout();
      wishlistStore.clearForLogout();
      return;
    }

    const syncAll = async () => {
      cartStore.setUser(user.id);
      wishlistStore.setUser(user.id);

      // Upsert user in Supabase
      const { data: existingUser } = await supabase
        .from("User")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existingUser) {
        await supabase.from("User").insert({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || user.firstName || "User",
          phone: user.primaryPhoneNumber?.phoneNumber || null,
        });
      }

      // Load cart
      const { data: cartData } = await supabase
        .from("Cart")
        .select("*, product:productId(*)")
        .eq("userId", user.id);

      if (cartData && cartData.length > 0) {
        const cartItems = cartData
          .filter((r) => r.product)
          .map((r) => ({ ...r.product, quantity: r.quantity }));
        useCartStore.setState({ items: cartItems, userId: user.id });
      }
      useCartStore.setState({ hydrated: true }); // ← mark done AFTER load

      // Load wishlist
      const { data: wishlistData } = await supabase
        .from("Wishlist")
        .select("*, product:productId(*)")
        .eq("userId", user.id);

      if (wishlistData && wishlistData.length > 0) {
        const wishlistItems = wishlistData
          .filter((r) => r.product)
          .map((r) => r.product);
        useWishlistStore.setState({ items: wishlistItems, userId: user.id });
      }
      useWishlistStore.setState({ hydrated: true }); // ← mark done AFTER load
    };

    syncAll();
  }, [isLoaded, isSignedIn, user?.id]);

  // Step 2: Only sync TO Supabase after hydration is complete
  const cartItems = useCartStore((s) => s.items);
  const cartHydrated = useCartStore((s) => s.hydrated); // ← guard

  useEffect(() => {
    if (!isSignedIn || !user || !cartHydrated) return; // ← skip if not hydrated
    const syncCart = async () => {
      await supabase.from("Cart").delete().eq("userId", user.id);
      if (cartItems.length > 0) {
        await supabase
          .from("Cart")
          .insert(
            cartItems.map((item) => ({
              userId: user.id,
              productId: item.id,
              quantity: item.quantity,
            })),
          );
      }
    };
    syncCart();
  }, [cartItems, cartHydrated, user?.id, isSignedIn]);

  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistHydrated = useWishlistStore((s) => s.hydrated); // ← guard

  useEffect(() => {
    if (!isSignedIn || !user || !wishlistHydrated) return; // ← skip if not hydrated
    const syncWishlist = async () => {
      await supabase.from("Wishlist").delete().eq("userId", user.id);
      if (wishlistItems.length > 0) {
        await supabase
          .from("Wishlist")
          .insert(
            wishlistItems.map((item) => ({
              userId: user.id,
              productId: item.id,
            })),
          );
      }
    };
    syncWishlist();
  }, [wishlistItems, wishlistHydrated, user?.id, isSignedIn]);
};

export default useUserSync;
