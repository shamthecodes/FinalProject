// src/pages/Cart.jsx
import React from "react";
import { useCartStore } from "../store/cartStore";
import { Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, getCount } =
    useCartStore();
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
        <div style={{ fontSize: "4rem" }}>🛒</div>
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.8rem",
            color: "#0d4d4d",
            margin: 0,
          }}
        >
          Your cart is empty
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.85rem",
            margin: 0,
          }}
        >
          Add some beautiful jewellery!
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
        Your Cart ({getCount()} items)
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "32px",
        }}
      >
        {/* ── CART ITEMS ──────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                gap: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <img
                src={item.images?.[0] || "/images/placeholder.png"}
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  backgroundColor: "#f7f0e9",
                }}
              />

              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "#d4af37",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "600",
                  }}
                >
                  {item.category}
                </span>
                <h3
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.1rem",
                    color: "#0d4d4d",
                    margin: "4px 0 8px",
                  }}
                >
                  {item.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  {/* Quantity */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid rgba(13,77,77,0.2)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0d4d4d",
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span
                      style={{
                        width: "32px",
                        textAlign: "center",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: "#0d4d4d",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0d4d4d",
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "700",
                      color: "#0d4d4d",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── ORDER SUMMARY ────────────────────────────────── */}
        <div style={{ width: isMobile ? "100%" : "320px", flexShrink: 0 }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              position: isMobile ? "static" : "sticky",
              top: "100px",
            }}
          >
            <h3
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.4rem",
                color: "#0d4d4d",
                margin: "0 0 20px",
              }}
            >
              Order Summary
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <Row
                label="Subtotal"
                value={`₹${getTotal().toLocaleString("en-IN")}`}
              />
              <Row label="Shipping" value="FREE" valueColor="#22c55e" />
              <div
                style={{
                  borderTop: "1px solid rgba(13,77,77,0.1)",
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "space-between",
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
                  Total
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: "#0d4d4d",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  ₹{getTotal().toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                width: "100%",
                padding: "16px",
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
                marginBottom: "12px",
              }}
            >
              PROCEED TO CHECKOUT
            </button>

            <button
              onClick={() => navigate("/collections")}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "transparent",
                color: "#0d4d4d",
                border: "1px solid rgba(13,77,77,0.2)",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: "600",
                letterSpacing: "1px",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                textTransform: "uppercase",
              }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, valueColor = "#0d4d4d" }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span
      style={{
        fontSize: "0.85rem",
        color: "#6b7280",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "0.85rem",
        fontWeight: "600",
        color: valueColor,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {value}
    </span>
  </div>
);

export default Cart;
