import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  Shield,
  RefreshCw,
  Truck,
  Star,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useUser } from "@clerk/clerk-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(id));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Product")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProduct(data);
        // Fetch related products
        const { data: relatedData } = await supabase
          .from("Product")
          .select("*")
          .eq("category", data.category)
          .neq("id", id)
          .limit(4);
        setRelated(relatedData || []);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f0e9",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(13,77,77,0.1)",
            borderTop: "3px solid #d4af37",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );

  if (!product)
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <p style={{ fontFamily: "Montserrat, sans-serif", color: "#6b7280" }}>
          Product not found
        </p>
        <button
          onClick={() => navigate("/collections")}
          style={{
            padding: "10px 24px",
            backgroundColor: "#0d4d4d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.8rem",
          }}
        >
          Browse Collections
        </button>
      </div>
    );

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f0e9" }}>
      {/* BREADCRUMB */}
      <div
        style={{
          padding: isMobile ? "16px 24px" : "20px 80px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.72rem",
          color: "#6b7280",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <span
          style={{ cursor: "pointer", color: "#0d4d4d" }}
          onClick={() => navigate("/")}
        >
          Home
        </span>
        <span>/</span>
        <span
          style={{ cursor: "pointer", color: "#0d4d4d" }}
          onClick={() => navigate("/collections")}
        >
          Collections
        </span>
        <span>/</span>
        <span
          style={{ cursor: "pointer", color: "#0d4d4d" }}
          onClick={() => navigate(`/collections/${product.category}`)}
        >
          {product.category}
        </span>
        <span>/</span>
        <span style={{ color: "#9ca3af" }}>{product.name}</span>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "48px",
          padding: isMobile ? "0 24px 40px" : "0 80px 60px",
        }}
      >
        {/* LEFT — Image Gallery */}
        <div style={{ flex: 1 }}>
          {/* Main image */}
          <div
            style={{
              width: "100%",
              height: isMobile ? "320px" : "520px",
              backgroundColor: "white",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              position: "relative",
            }}
          >
            <img
              src={product.images?.[activeImage]}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              onError={(e) =>
                (e.target.src =
                  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600")
              }
            />

            {/* Discount badge */}
            {discount && (
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  backgroundColor: "#0d4d4d",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div style={{ display: "flex", gap: "8px" }}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: `2px solid ${activeImage === i ? "#d4af37" : "transparent"}`,
                    opacity: activeImage === i ? 1 : 0.7,
                    transition: "all 0.2s",
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Details */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Category + Metal */}
          <div style={{ display: "flex", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.62rem",
                color: "#d4af37",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontWeight: "600",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {product.category}
            </span>
            <span style={{ color: "#e5e7eb" }}>•</span>
            <span
              style={{
                fontSize: "0.62rem",
                color: "#6b7280",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {product.metal}
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: isMobile ? "1.8rem" : "2.4rem",
              fontWeight: "700",
              color: "#0d4d4d",
              margin: 0,
              fontFamily: "Cormorant Garamond, serif",
              lineHeight: "1.2",
            }}
          >
            {product.name}
          </h1>

          {/* Rating — placeholder */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i <= 4 ? "#d4af37" : "none"}
                  color="#d4af37"
                />
              ))}
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              4.0 (24 reviews)
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#0d4d4d",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrp > product.price && (
              <>
                <span
                  style={{
                    fontSize: "1.1rem",
                    color: "#9ca3af",
                    textDecoration: "line-through",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  ₹{product.mrp.toLocaleString("en-IN")}
                </span>
                <span
                  style={{
                    backgroundColor: "rgba(212,175,55,0.15)",
                    color: "#d4af37",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  SAVE ₹{(product.mrp - product.price).toLocaleString("en-IN")}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "0.9rem",
              color: "#6b7280",
              lineHeight: "1.8",
              margin: 0,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "300",
              borderTop: "1px solid rgba(13,77,77,0.08)",
              paddingTop: "16px",
            }}
          >
            {product.description}
          </p>

          {/* Details grid */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {[
              { label: "Metal", value: product.metal },
              { label: "Stone", value: product.stone || "None" },
              {
                label: "Weight",
                value: product.weight ? `${product.weight}g` : "N/A",
              },
              {
                label: "Stock",
                value:
                  product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock",
              },
            ].map((detail) => (
              <div key={detail.label}>
                <p
                  style={{
                    fontSize: "0.58rem",
                    color: "#9ca3af",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    margin: "0 0 4px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {detail.label}
                </p>
                <p
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: "600",
                    color: "#0d4d4d",
                    margin: 0,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {detail.value}
                </p>
              </div>
            ))}
          </div>

          {/* Stock warning */}
          {product.stock <= 3 && product.stock > 0 && (
            <div
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "0.78rem",
                color: "#dc2626",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              ⚠️ Only {product.stock} left in stock — order soon!
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => {
                const success = addItem(product, isSignedIn, navigate);
                if (success) {
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }
              }}
              disabled={product.stock === 0}
              style={{
                flex: 1,
                padding: "16px",
                backgroundColor:
                  product.stock === 0
                    ? "#9ca3af"
                    : added
                      ? "#d4af37"
                      : "#0d4d4d",
                color: added ? "#0d4d4d" : "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: product.stock === 0 ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                textTransform: "uppercase",
                fontFamily: "Montserrat, sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <ShoppingBag size={16} />
              {product.stock === 0
                ? "OUT OF STOCK"
                : added
                  ? "✓ ADDED TO CART"
                  : "ADD TO CART"}
            </button>

            <button
              onClick={() => toggleWishlist(product, isSignedIn, navigate)}
              style={{
                width: "52px",
                height: "52px",
                backgroundColor: "white",
                border: `1px solid ${isWishlisted ? "#d4af37" : "rgba(13,77,77,0.15)"}`,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Heart
                size={20}
                fill={isWishlisted ? "#d4af37" : "none"}
                color={isWishlisted ? "#d4af37" : "#0d4d4d"}
              />
            </button>
          </div>

          {/* Try On button */}
          <button
            onClick={() => navigate("/try-on")}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "rgba(212,175,55,0.1)",
              color: "#0d4d4d",
              border: "1px solid rgba(212,175,55,0.4)",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: "600",
              letterSpacing: "1px",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            ✨ Try this jewellery with AI Stylist
          </button>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderTop: "1px solid rgba(13,77,77,0.08)",
              paddingTop: "20px",
            }}
          >
            {[
              {
                icon: <Shield size={16} />,
                text: "Certified & Hallmarked Jewelry",
              },
              {
                icon: <RefreshCw size={16} />,
                text: "Lifetime Exchange Policy",
              },
              {
                icon: <Truck size={16} />,
                text: `Free Shipping${product.price >= 1999 ? " on this order" : " above ₹1999"}`,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#0d4d4d",
                  fontSize: "0.8rem",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div
          style={{
            padding: isMobile ? "32px 24px" : "40px 80px",
            borderTop: "1px solid rgba(13,77,77,0.08)",
            backgroundColor: "white",
          }}
        >
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: isMobile ? "1.6rem" : "2rem",
              color: "#0d4d4d",
              marginBottom: "24px",
              fontWeight: "700",
            }}
          >
            You May Also Like
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {related.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                style={{
                  backgroundColor: "#f7f0e9",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-3px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ height: "180px", overflow: "hidden" }}>
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300")
                    }
                  />
                </div>
                <div style={{ padding: "12px" }}>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#0d4d4d",
                      fontFamily: "Cormorant Garamond, serif",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#0d4d4d",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); }}
      `}</style>
    </div>
  );
};

export default ProductDetails;
