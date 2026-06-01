import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";
import { sendOrderEmail } from "../lib/sendOrderEmail";
import {
  Shield,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Truck,
} from "lucide-react";
// import { checkPaymentAllowed } from "@/lib/arcjetClient";

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { items, getTotal, clearCart } = useCartStore();
  const [isMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("checkoutAddress");
    if (!saved) {
      navigate("/checkout");
      return;
    }
    setAddress(JSON.parse(saved));
  }, []);

  // ✅ Correct — use useEffect for navigation
  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items.length]);

  if (items.length === 0) return null;

  const total = getTotal();

  const paymentMethods = [
    {
      id: "upi",
      label: "UPI",
      desc: "GPay, PhonePe, Paytm",
      icon: <Smartphone size={18} />,
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      desc: "Visa, Mastercard, RuPay",
      icon: <CreditCard size={18} />,
    },
    {
      id: "netbanking",
      label: "Net Banking",
      desc: "All major banks",
      icon: <Building2 size={18} />,
    },
    {
      id: "wallet",
      label: "Wallets",
      desc: "Paytm, Freecharge, Mobikwik",
      icon: <Wallet size={18} />,
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      desc: "Pay when your order arrives • OTP verification required",
      icon: <Truck size={18} />,
    },
  ];

  // Generate 6-digit OTP
  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handlePayment = async () => {
    // const { allowed, error } = await checkPaymentAllowed();
    // if (!allowed) {
    //   alert(`🚫 ${error}`);
    //   return;
    // }

    if (selectedMethod === "cod") {
      handleCOD();
      return;
    }

    setLoading(true);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: "INR",
      name: "JewelsNow",
      description: `${items.length} item${items.length > 1 ? "s" : ""}`,
      prefill: {
        name: `${address?.firstName} ${address?.lastName}`,
        email: address?.email,
        contact: address?.phone,
      },
      theme: { color: "#0d4d4d" },
      handler: async (response) => {
        await saveOrder(response.razorpay_payment_id, "PAID");
      },
      modal: { ondismiss: () => setLoading(false) },
    };
    const razor = new window.Razorpay(options);
    razor.on("payment.failed", () => {
      setLoading(false);
      alert("Payment failed. Please try again.");
    });
    razor.open();
  };

  const handleCOD = async () => {
    setLoading(true);
    const otp = generateOTP();
    await saveOrder("COD-" + Date.now(), "PENDING", otp);
  };

  const saveOrder = async (paymentId, paymentStatus, otp = null) => {
    try {
      const orderData = {
        userId: user.id,
        status: selectedMethod === "cod" ? "pending" : "confirmed",
        total: total,
        paymentMethod: selectedMethod.toUpperCase(),
        paymentId: paymentId,
        paymentStatus: paymentStatus,
        address: address,
      };

      // Add OTP for COD
      if (otp) orderData.deliveryOtp = otp;

      const { data: order, error } = await supabase
        .from("Order")
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // Save order items
      await supabase.from("OrderItem").insert(
        items.map((item) => ({
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      );

      // Clear cart
      await supabase.from("Cart").delete().eq("userId", user.id);
      clearCart();

      // Send confirmation email
      await sendOrderEmail(order, address, items, otp, selectedMethod);

      console.log("OTP sent to email:", otp); // ← add this check

      sessionStorage.setItem("lastOrderId", order.id);
      sessionStorage.removeItem("checkoutAddress");

      navigate("/order-confirmed");
    } catch (err) {
      console.error("Order error:", err);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f0e9" }}>
      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#0d4d4d",
          padding: isMobile ? "20px 24px" : "24px 80px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={() => navigate("/checkout")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          ← Back
        </button>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
        <h1
          style={{
            color: "white",
            margin: 0,
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.4rem",
            fontWeight: "600",
          }}
        >
          Payment
        </h1>
      </div>

      {/* STEPS */}
      <div
        style={{
          backgroundColor: "white",
          padding: isMobile ? "12px 24px" : "12px 80px",
          display: "flex",
          borderBottom: "1px solid rgba(13,77,77,0.08)",
        }}
      >
        {["Cart", "Checkout", "Payment", "Confirmed"].map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor:
                    i === 2
                      ? "#0d4d4d"
                      : i < 2
                        ? "#d4af37"
                        : "rgba(13,77,77,0.1)",
                  color: i <= 2 ? "white" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                }}
              >
                {i < 2 ? "✓" : i + 1}
              </div>
              {!isMobile && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: i === 2 ? "700" : "400",
                    color: i === 2 ? "#0d4d4d" : i < 2 ? "#d4af37" : "#9ca3af",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {step}
                </span>
              )}
            </div>
            {i < 3 && (
              <div
                style={{
                  width: "20px",
                  height: "1px",
                  backgroundColor: "rgba(13,77,77,0.1)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "28px",
          padding: isMobile ? "20px 16px" : "32px 80px",
        }}
      >
        {/* LEFT — Payment Methods */}
        <div style={{ flex: 1 }}>
          {/* Address summary */}
          {address && (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "14px 18px",
                marginBottom: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "0.68rem",
                    fontWeight: "700",
                    color: "#9ca3af",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Delivering to
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#0d4d4d",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {address.firstName} {address.lastName} • {address.phone}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {address.address}, {address.city}, {address.state} -{" "}
                  {address.pincode}
                </p>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(13,77,77,0.2)",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#0d4d4d",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Change
              </button>
            </div>
          )}

          {/* Payment selection */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "24px",
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
              Choose Payment Method
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: `2px solid ${selectedMethod === method.id ? "#0d4d4d" : "rgba(13,77,77,0.1)"}`,
                    backgroundColor:
                      selectedMethod === method.id
                        ? method.id === "cod"
                          ? "rgba(212,175,55,0.05)"
                          : "rgba(13,77,77,0.03)"
                        : "white",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: `2px solid ${selectedMethod === method.id ? "#0d4d4d" : "rgba(13,77,77,0.3)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {selectedMethod === method.id && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#0d4d4d",
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      color:
                        method.id === "cod"
                          ? "#d4af37"
                          : selectedMethod === method.id
                            ? "#0d4d4d"
                            : "#6b7280",
                    }}
                  >
                    {method.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.88rem",
                        fontWeight: "600",
                        color: "#0d4d4d",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {method.label}
                      {method.id === "cod" && (
                        <span
                          style={{
                            marginLeft: "8px",
                            backgroundColor: "rgba(212,175,55,0.15)",
                            color: "#d4af37",
                            fontSize: "0.6rem",
                            fontWeight: "700",
                            padding: "2px 6px",
                            borderRadius: "3px",
                          }}
                        >
                          OTP on Delivery
                        </span>
                      )}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.72rem",
                        color: "#9ca3af",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {method.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* COD notice */}
            {selectedMethod === "cod" && (
              <div
                style={{
                  marginTop: "16px",
                  backgroundColor: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  fontSize: "0.78rem",
                  color: "#0d4d4d",
                  fontFamily: "Montserrat, sans-serif",
                  lineHeight: "1.7",
                }}
              >
                <strong>📦 Cash on Delivery Info:</strong>
                <br />
                • A 6-digit OTP will be sent to your email
                <br />
                • Share this OTP with delivery person to confirm receipt
                <br />
                • Payment collected in cash at doorstep
                <br />• Keep exact change ready if possible
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "16px",
                backgroundColor: loading
                  ? "#9ca3af"
                  : selectedMethod === "cod"
                    ? "#d4af37"
                    : "#0d4d4d",
                color: selectedMethod === "cod" ? "#0d4d4d" : "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Montserrat, sans-serif",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Processing...
                </>
              ) : selectedMethod === "cod" ? (
                <>📦 PLACE COD ORDER — ₹{total.toLocaleString("en-IN")}</>
              ) : (
                <>🔒 PAY ₹{total.toLocaleString("en-IN")}</>
              )}
            </button>

            <p
              style={{
                textAlign: "center",
                marginTop: "10px",
                fontSize: "0.68rem",
                color: "#9ca3af",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {selectedMethod === "cod"
                ? "📧 OTP will be sent to your email"
                : "🔒 Secured by Razorpay • 100% Safe"}
            </p>
          </div>
        </div>

        {/* RIGHT — Summary */}
        <div style={{ width: isMobile ? "100%" : "300px", flexShrink: 0 }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              position: isMobile ? "static" : "sticky",
              top: "20px",
            }}
          >
            <h3
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.2rem",
                color: "#0d4d4d",
                margin: "0 0 14px",
                fontWeight: "700",
              }}
            >
              Order Summary
            </h3>

            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  style={{
                    width: "44px",
                    height: "44px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    backgroundColor: "#f7f0e9",
                    flexShrink: 0,
                  }}
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100")
                  }
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      color: "#0d4d4d",
                      fontFamily: "Montserrat, sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.65rem",
                      color: "#9ca3af",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Qty: {item.quantity}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    color: "#0d4d4d",
                    fontFamily: "Montserrat, sans-serif",
                    flexShrink: 0,
                  }}
                >
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}

            <div
              style={{
                borderTop: "1px solid rgba(13,77,77,0.08)",
                paddingTop: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#6b7280",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "#0d4d4d",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#6b7280",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Shipping
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "#22c55e",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  FREE
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(13,77,77,0.08)",
                  paddingTop: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    color: "#0d4d4d",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    color: "#0d4d4d",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );
};

export default Payment;
