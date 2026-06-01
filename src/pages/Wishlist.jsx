import React from "react";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isMobile] = React.useState(window.innerWidth < 768);

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          backgroundColor: "#f7f0e9",
        }}
      >
        <Heart size={48} color="rgba(13,77,77,0.2)" />
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.8rem",
            color: "#0d4d4d",
            margin: 0,
          }}
        >
          Your wishlist is empty
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.85rem",
            margin: 0,
          }}
        >
          Save your favourite jewellery here!
        </p>
        <button
          onClick={() => navigate("/collections")}
          style={{
            padding: "12px 32px",
            backgroundColor: "#0d4d4d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.78rem",
            fontWeight: "700",
            letterSpacing: "2px",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            textTransform: "uppercase",
          }}
        >
          EXPLORE COLLECTION
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f0e9",
        padding: isMobile ? "24px 16px" : "40px 80px",
      }}
    >
      <h1
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: isMobile ? "2rem" : "2.8rem",
          color: "#0d4d4d",
          marginBottom: "32px",
          fontWeight: "700",
        }}
      >
        My Wishlist ({items.length} items)
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              position: "relative",
            }}
          >
            {/* Remove from wishlist */}
            <button
              onClick={() => removeItem(item.id)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                backgroundColor: "white",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 2,
              }}
            >
              <Trash2 size={14} color="#ef4444" />
            </button>

            {/* Image */}
            <div
              style={{
                width: "100%",
                height: "220px",
                backgroundColor: "#f7f0e9",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img
                src={item.images?.[0]}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) =>
                  (e.target.src =
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500")
                }
              />
            </div>

            {/* Details */}
            <div style={{ padding: "16px" }}>
              <span
                style={{
                  fontSize: "0.6rem",
                  color: "#d4af37",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {item.category}
              </span>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#0d4d4d",
                  margin: "4px 0 8px",
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#0d4d4d",
                  fontFamily: "Montserrat, sans-serif",
                  margin: "0 0 12px",
                }}
              >
                ₹{item.price.toLocaleString("en-IN")}
              </p>

              <button
                onClick={() => addItem(item, isSignedIn, navigate)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#0d4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <ShoppingBag size={14} />
                ADD TO CART
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
