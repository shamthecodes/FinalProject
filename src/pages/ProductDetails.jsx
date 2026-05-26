// src/pages/ProductDetail.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProducts(id);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(id));

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount =
    product?.mrp > product?.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

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
            border: "3px solid #0d4d4d",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );

  if (error || !product)
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
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.6rem",
            color: "#0d4d4d",
          }}
        >
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
          }}
        >
          Back to Collections
        </button>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f0e9",
        padding: "40px 80px",
      }}
    >
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#6b7280",
          fontSize: "0.82rem",
          fontFamily: "Montserrat, sans-serif",
          marginBottom: "32px",
          padding: 0,
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
        {/* ── IMAGES ─────────────────────────────────────────── */}
        <div style={{ flex: "0 0 480px" }}>
          <div
            style={{
              width: "100%",
              height: "500px",
              backgroundColor: "white",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: "12px",
            }}
          >
            <img
              src={product.images?.[activeImg] || "/images/placeholder.png"}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: "flex", gap: "8px" }}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      activeImg === i
                        ? "2px solid #0d4d4d"
                        : "2px solid transparent",
                    opacity: activeImg === i ? 1 : 0.6,
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

        {/* ── DETAILS ────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <span
            style={{
              fontSize: "0.6rem",
              color: "#d4af37",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: "600",
            }}
          >
            {product.category}
          </span>

          <h1
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "2.4rem",
              color: "#0d4d4d",
              margin: "8px 0 16px",
              lineHeight: "1.2",
              fontWeight: "700",
            }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontSize: "1.8rem",
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
                    backgroundColor: "#0d4d4d",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    letterSpacing: "1px",
                  }}
                >
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p
            style={{
              color: "#4b5563",
              lineHeight: "1.7",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.88rem",
              marginBottom: "28px",
            }}
          >
            {product.description}
          </p>

          {/* Specs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            {[
              { label: "Metal", value: product.metal },
              { label: "Stone", value: product.stone },
              {
                label: "Weight",
                value: product.weight ? `${product.weight}g` : null,
              },
              {
                label: "In Stock",
                value:
                  product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock",
              },
            ]
              .filter((s) => s.value)
              .map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "6px",
                    padding: "10px 16px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.58rem",
                      color: "#d4af37",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      margin: "0 0 2px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#0d4d4d",
                      fontWeight: "600",
                      margin: 0,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                flex: 1,
                padding: "16px",
                backgroundColor: added ? "#d4af37" : "#0d4d4d",
                color: added ? "#0d4d4d" : "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.78rem",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: product.stock > 0 ? "pointer" : "not-allowed",
                transition: "all 0.3s",
                textTransform: "uppercase",
                fontFamily: "Montserrat, sans-serif",
                opacity: product.stock === 0 ? 0.5 : 1,
              }}
            >
              {product.stock === 0
                ? "OUT OF STOCK"
                : added
                  ? "✓ ADDED TO CART"
                  : "ADD TO CART"}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "4px",
                border: "1px solid rgba(13,77,77,0.2)",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Heart
                size={20}
                fill={isWishlisted ? "#d4af37" : "none"}
                color={isWishlisted ? "#d4af37" : "#6b7280"}
              />
            </button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderTop: "1px solid rgba(13,77,77,0.1)",
              paddingTop: "24px",
            }}
          >
            {[
              {
                icon: <Shield size={16} />,
                text: "Certified authentic jewellery",
              },
              {
                icon: <Truck size={16} />,
                text: "Free insured shipping across India",
              },
              {
                icon: <RotateCcw size={16} />,
                text: "15-day hassle-free returns",
              },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#4b5563",
                  fontSize: "0.82rem",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                <span style={{ color: "#0d4d4d" }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
