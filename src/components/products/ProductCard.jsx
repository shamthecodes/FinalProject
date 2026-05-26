import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const success = addItem(product, isSignedIn, navigate);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product, isSignedIn, navigate);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
    >
      {/* DISCOUNT BADGE */}
      {discount && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            backgroundColor: "#0d4d4d",
            color: "white",
            fontSize: "0.6rem",
            fontWeight: "700",
            padding: "4px 8px",
            borderRadius: "4px",
            zIndex: 2,
            letterSpacing: "1px",
          }}
        >
          -{discount}%
        </div>
      )}

      {/* WISHLIST */}
      <button
        onClick={handleWishlist}
        title={!isSignedIn ? "Login to add to wishlist" : ""}
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
        <Heart
          size={16}
          fill={isWishlisted && isSignedIn ? "#d4af37" : "none"}
          color={isWishlisted && isSignedIn ? "#d4af37" : "#6b7280"}
        />
      </button>

      {/* IMAGE */}
      <div
        style={{
          width: "100%",
          height: "220px",
          backgroundColor: "#f7f0e9",
          overflow: "hidden",
        }}
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          onError={(e) =>
            (e.target.src =
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500")
          }
        />
      </div>

      {/* DETAILS */}
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
          {product.category}
        </span>

        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: "600",
            color: "#0d4d4d",
            margin: "4px 0 8px",
            fontFamily: "Cormorant Garamond, serif",
            lineHeight: "1.3",
          }}
        >
          {product.name}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              color: "#0d4d4d",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.mrp > product.price && (
            <span
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                textDecoration: "line-through",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: added ? "#d4af37" : "#0d4d4d",
            color: added ? "#0d4d4d" : "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.72rem",
            fontWeight: "700",
            letterSpacing: "1px",
            cursor: "pointer",
            transition: "all 0.3s",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {!isSignedIn ? "LOGIN TO BUY" : added ? "✓ ADDED" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
