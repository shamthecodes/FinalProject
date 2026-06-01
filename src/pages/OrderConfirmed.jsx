import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CheckCircle, Package, MapPin } from "lucide-react";

const OrderConfirmed = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isMobile] = useState(window.innerWidth < 768);
  const orderId = sessionStorage.getItem("lastOrderId");

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }
    const fetchOrder = async () => {
      const { data } = await supabase
        .from("Order")
        .select("*, items:OrderItem(*, product:productId(*))")
        .eq("id", orderId)
        .single();
      setOrder(data);
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f0e9" }}>
      {/* SUCCESS BANNER */}
      <div
        style={{
          backgroundColor: "#0d4d4d",
          padding: isMobile ? "48px 24px" : "60px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "60px solid rgba(212,175,55,0.06)",
            top: "-150px",
            right: "-100px",
          }}
        />

        {/* Animated checkmark */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "#d4af37",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 0 0 12px rgba(212,175,55,0.15)",
          }}
        >
          <CheckCircle size={36} color="#0d4d4d" />
        </div>

        <h1
          style={{
            fontSize: isMobile ? "2rem" : "2.8rem",
            fontWeight: "700",
            color: "white",
            margin: "0 0 8px",
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          Order Confirmed! 🎉
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.9rem",
            margin: "0 0 16px",
          }}
        >
          Thank you for your purchase. Your jewellery is being prepared!
        </p>

        {order && (
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "6px",
              padding: "10px 20px",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.7rem",
                letterSpacing: "2px",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              ORDER ID
            </span>
            <p
              style={{
                color: "#d4af37",
                fontWeight: "700",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.9rem",
                margin: "2px 0 0",
                letterSpacing: "1px",
              }}
            >
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        )}
      </div>
      {/* OTP display for COD orders */}
      {order?.paymentMethod === "COD" && order?.deliveryOtp && (
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "rgba(212,175,55,0.15)",
            border: "2px dashed #d4af37",
            borderRadius: "8px",
            padding: "16px 24px",
            display: "inline-block",
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
              fontSize: "0.68rem",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            🔐 Your Delivery OTP
          </p>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: "2.4rem",
              fontWeight: "900",
              color: "#d4af37",
              letterSpacing: "8px",
              fontFamily: "monospace",
            }}
          >
            {order.deliveryOtp}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.68rem",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Share only with delivery person
          </p>
        </div>
      )}
      <div
        style={{
          padding: isMobile ? "24px 16px" : "40px 80px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* ORDER STATUS TIMELINE */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.4rem",
              color: "#0d4d4d",
              margin: "0 0 24px",
              fontWeight: "700",
            }}
          >
            Order Status
          </h2>

          {/* Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              {
                label: "Order Confirmed",
                desc: "Your order has been placed successfully",
                done: true,
                active: true,
              },
              {
                label: "Processing",
                desc: "Jewellery being carefully packed",
                done: false,
                active: false,
              },
              {
                label: "Shipped",
                desc: "Out for delivery",
                done: false,
                active: false,
              },
              {
                label: "Delivered",
                desc: "Delivered to your doorstep",
                done: false,
                active: false,
              },
            ].map((step, i, arr) => (
              <div key={step.label} style={{ display: "flex", gap: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: step.done
                        ? "#d4af37"
                        : step.active
                          ? "#0d4d4d"
                          : "rgba(13,77,77,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {step.done ? (
                      <span style={{ color: "#0d4d4d", fontSize: "1rem" }}>
                        ✓
                      </span>
                    ) : (
                      <span
                        style={{
                          color: step.active ? "white" : "#9ca3af",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                        }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        width: "2px",
                        height: "40px",
                        backgroundColor: step.done
                          ? "#d4af37"
                          : "rgba(13,77,77,0.1)",
                      }}
                    />
                  )}
                </div>
                <div
                  style={{ paddingBottom: i < arr.length - 1 ? "24px" : "0" }}
                >
                  <p
                    style={{
                      margin: "4px 0 4px",
                      fontSize: "0.88rem",
                      fontWeight: "600",
                      color: step.done || step.active ? "#0d4d4d" : "#9ca3af",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER ITEMS */}
        {order?.items && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.4rem",
                color: "#0d4d4d",
                margin: "0 0 20px",
                fontWeight: "700",
              }}
            >
              Items Ordered
            </h2>
            {order.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.name}
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    backgroundColor: "#f7f0e9",
                  }}
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100")
                  }
                />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "0.88rem",
                      fontWeight: "600",
                      color: "#0d4d4d",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {item.product?.name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Qty: {item.quantity} × ₹
                    {item.price?.toLocaleString("en-IN")}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    color: "#0d4d4d",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}

            <div
              style={{
                borderTop: "1px solid rgba(13,77,77,0.08)",
                paddingTop: "14px",
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
                Total Paid
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#0d4d4d",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                ₹{order.total?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              const lastOrderId = sessionStorage.getItem("lastOrderId");
              if (lastOrderId) navigate(`/track-order/${lastOrderId}`);
              else navigate("/collections"); // fallback if no order
            }}
            style={{
              flex: 1,
              padding: "14px 24px",
              backgroundColor: "#0d4d4d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: "700",
              letterSpacing: "1px",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <MapPin size={16} />
            TRACK ORDER
          </button>
          <button
            onClick={() => navigate("/collections")}
            style={{
              flex: 1,
              padding: "14px 24px",
              backgroundColor: "transparent",
              color: "#0d4d4d",
              border: "1px solid rgba(13,77,77,0.2)",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Package size={16} />
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmed;
