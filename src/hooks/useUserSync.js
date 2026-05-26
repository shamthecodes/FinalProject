import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

const useUserSync = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);

  // ── Sync User ──
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      const { data: existingUser } = await supabase
        .from("User")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existingUser) {
        const { error } = await supabase.from("User").insert({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || user.firstName || "User",
          phone: user.primaryPhoneNumber?.phoneNumber || null,
        });
        if (error) console.error("❌ User error:", error.message);
        else console.log("✅ User saved!");
      }
    };
    syncUser();
  }, [isLoaded, isSignedIn, user?.id]);

  // ── Sync Cart ──
  useEffect(() => {
    const syncCart = async () => {
      if (!isSignedIn || !user) return;

      // Delete existing cart
      await supabase.from("Cart").delete().eq("userId", user.id);

      if (cartItems.length > 0) {
        const cartRows = cartItems.map((item) => ({
          // No id needed — Supabase auto generates it now
          userId: user.id,
          productId: item.id,
          quantity: item.quantity,
        }));

        const { error } = await supabase.from("Cart").insert(cartRows);
        if (error) console.error("❌ Cart error:", error.message);
        else console.log("✅ Cart synced!", cartRows.length, "items");
      }
    };
    syncCart();
  }, [cartItems.length, isSignedIn, user?.id]);

  // ── Sync Wishlist ──
  useEffect(() => {
    const syncWishlist = async () => {
      if (!isSignedIn || !user) return;

      await supabase.from("Wishlist").delete().eq("userId", user.id);

      if (wishlistItems.length > 0) {
        const wishlistRows = wishlistItems.map((item) => ({
          userId: user.id,
          productId: item.id,
        }));

        const { error } = await supabase.from("Wishlist").insert(wishlistRows);
        if (error) console.error("❌ Wishlist error:", error.message);
        else console.log("✅ Wishlist synced!", wishlistRows.length, "items");
      }
    };
    syncWishlist();
  }, [wishlistItems.length, isSignedIn, user?.id]);
};

export default useUserSync;
