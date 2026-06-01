import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useUser } from "@clerk/clerk-react";

// ✅ Field is defined OUTSIDE Checkout so it's not recreated on every render
const Field = ({
  label,
  name,
  placeholder,
  type = "text",
  required = true,
  form,
  errors,
  handleChange,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label
      style={{
        fontSize: "0.68rem",
        fontWeight: "700",
        color: "#0d4d4d",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={form[name]}
      onChange={handleChange}
      placeholder={placeholder}
      style={{
        padding: "12px 14px",
        border: `1px solid ${errors[name] ? "#fca5a5" : "rgba(13,77,77,0.2)"}`,
        borderRadius: "6px",
        fontSize: "0.88rem",
        color: "#0d4d4d",
        outline: "none",
        fontFamily: "Montserrat, sans-serif",
        backgroundColor: errors[name] ? "#fef2f2" : "white",
        width: "100%",
        boxSizing: "border-box",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#0d4d4d")}
      onBlur={(e) =>
        (e.target.style.borderColor = errors[name]
          ? "#fca5a5"
          : "rgba(13,77,77,0.2)")
      }
    />
    {errors[name] && (
      <span
        style={{
          fontSize: "0.7rem",
          color: "#dc2626",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {errors[name]}
      </span>
    )}
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { items, getTotal } = useCartStore();
  const [isMobile] = useState(window.innerWidth < 768);

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    else if (!/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Enter valid 10-digit number";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.pincode.trim()) e.pincode = "Required";
    else if (!/^\d{6}$/.test(form.pincode))
      e.pincode = "Enter valid 6-digit pincode";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    sessionStorage.setItem("checkoutAddress", JSON.stringify(form));
    navigate("/payment");
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  // Shared props passed down to every Field
  const fieldProps = { form, errors, handleChange, isMobile };

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
          onClick={() => navigate("/cart")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          ← Back to Cart
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
          Checkout
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
                    i === 1
                      ? "#0d4d4d"
                      : i < 1
                        ? "#d4af37"
                        : "rgba(13,77,77,0.1)",
                  color: i <= 1 ? "white" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                }}
              >
                {i < 1 ? "✓" : i + 1}
              </div>
              {!isMobile && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: i === 1 ? "700" : "400",
                    color: i === 1 ? "#0d4d4d" : i < 1 ? "#d4af37" : "#9ca3af",
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
        {/* LEFT — Address */}
        <div style={{ flex: 1 }}>
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
                fontSize: "1.5rem",
                color: "#0d4d4d",
                margin: "0 0 20px",
                fontWeight: "700",
              }}
            >
              Delivery Address
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "16px",
                }}
              >
                <Field
                  label="First Name"
                  name="firstName"
                  placeholder="Priya"
                  {...fieldProps}
                />
                <Field
                  label="Last Name"
                  name="lastName"
                  placeholder="Sharma"
                  {...fieldProps}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "16px",
                }}
              >
                <Field
                  label="Email"
                  name="email"
                  placeholder="priya@gmail.com"
                  type="email"
                  {...fieldProps}
                />
                <Field
                  label="Phone"
                  name="phone"
                  placeholder="9876543210"
                  type="tel"
                  {...fieldProps}
                />
              </div>

              <Field
                label="Full Address"
                name="address"
                placeholder="House No., Street, Area"
                {...fieldProps}
              />

              <Field
                label="Landmark"
                name="landmark"
                placeholder="Near temple, opposite park"
                required={false}
                {...fieldProps}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <Field
                  label="City"
                  name="city"
                  placeholder="Chennai"
                  {...fieldProps}
                />
                <Field
                  label="State"
                  name="state"
                  placeholder="Tamil Nadu"
                  {...fieldProps}
                />
                <Field
                  label="Pincode"
                  name="pincode"
                  placeholder="600001"
                  {...fieldProps}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div style={{ width: isMobile ? "100%" : "320px", flexShrink: 0 }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              position: isMobile ? "static" : "sticky",
              top: "20px",
            }}
          >
            <h3
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.3rem",
                color: "#0d4d4d",
                margin: "0 0 16px",
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
                  marginBottom: "12px",
                }}
              >
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  style={{
                    width: "48px",
                    height: "48px",
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
                      margin: "0 0 2px",
                      fontSize: "0.8rem",
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
                      fontSize: "0.68rem",
                      color: "#9ca3af",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Qty: {item.quantity}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "0.82rem",
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
                paddingTop: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "#6b7280",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#0d4d4d",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  ₹{getTotal().toLocaleString("en-IN")}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "#6b7280",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Shipping
                </span>
                <span
                  style={{
                    fontSize: "0.82rem",
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
                  paddingTop: "10px",
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
              onClick={handleSubmit}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "16px",
                backgroundColor: "#0d4d4d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.82rem",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                textTransform: "uppercase",
              }}
            >
              PROCEED TO PAYMENT →
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
              🔒 Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
