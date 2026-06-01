import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { supabase } from "../lib/supabase";
import { Phone, MessageCircle, Star } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const deliveryIcon = new L.DivIcon({
  html: `<div style="background:#d4af37;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <span style="transform:rotate(45deg);font-size:14px;">🚚</span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
  className: "",
});

const youIcon = new L.DivIcon({
  html: `<div style="background:#0d4d4d;width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
  className: "",
});

const shopIcon = new L.DivIcon({
  html: `<div style="background:#d4af37;width:36px;height:36px;border-radius:8px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;">💍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
  className: "",
});

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);
  return null;
};

// Star Rating Component
const StarRating = ({ rating, onRate, label }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      alignItems: "center",
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: "0.72rem",
        color: "#6b7280",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {label}
    </p>
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          fill={star <= rating ? "#d4af37" : "none"}
          color={star <= rating ? "#d4af37" : "#d1d5db"}
          style={{ cursor: "pointer", transition: "all 0.1s" }}
          onClick={() => onRate(star)}
        />
      ))}
    </div>
  </div>
);

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isMobile] = useState(window.innerWidth < 768);

  // Location states
  const [yourLocation, setYourLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [deliveryPos, setDeliveryPos] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [shopLocation, setShopLocation] = useState(null);
  const [distanceMeters, setDistanceMeters] = useState(null);
  const intervalRef = useRef(null);

  // OTP states
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [deliveryArrived, setDeliveryArrived] = useState(false);

  // Rating states
  const [showRating, setShowRating] = useState(false);
  const [productRating, setProductRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingComment, setRatingComment] = useState("");

  const deliveryAgent = {
    name: "Rajan Kumar",
    phone: "+919876543210",
    vehicle: "TN 01 AB 1234",
  };

  const orderStatuses = [
    { label: "Order Confirmed", time: "Today, 10:30 AM", done: true },
    { label: "Packed & Ready", time: "Today, 11:15 AM", done: true },
    { label: "Picked Up", time: "Today, 2:00 PM", done: true },
    {
      label: "Out for Delivery",
      time: "Now",
      done: true,
      active: !otpVerified,
    },
    {
      label: "Delivered",
      time: otpVerified ? "✅ Delivered" : "Arriving soon...",
      done: otpVerified,
    },
  ];

  // Calculate distance in meters
  const calcDistanceMeters = (p1, p2) => {
    if (!p1 || !p2) return null;
    const R = 6371000;
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const formatDistance = (meters) => {
    if (meters === null) return "Tracking...";
    if (meters < 50) return "Arrived! 🎉";
    if (meters < 1000) return `${Math.round(meters)}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  };

  // GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const yourPos = { lat: latitude, lng: longitude };
        setYourLocation(yourPos);
        setMapCenter(yourPos);
        setLocationLoading(false);

        const shop = { lat: latitude + 0.013, lng: longitude + 0.01 };
        setShopLocation(shop);
        setDeliveryPos({ ...shop });

        // Move delivery toward user every 5 seconds
        intervalRef.current = setInterval(() => {
          setDeliveryPos((prev) => {
            if (!prev) return shop;
            const latDiff = yourPos.lat - prev.lat;
            const lngDiff = yourPos.lng - prev.lng;
            const dist = calcDistanceMeters(prev, yourPos);

            // When within 50 meters — ARRIVED!
            if (dist !== null && dist < 50) {
              clearInterval(intervalRef.current);
              setDeliveryArrived(true);
              setShowOtpPopup(true); // ← auto show OTP popup!
              setDistanceMeters(0);
              return yourPos; // snap to your location
            }

            setDistanceMeters(dist);
            return {
              lat: prev.lat + latDiff * 0.08,
              lng: prev.lng + lngDiff * 0.08,
            };
          });
        }, 5000);
      },
      () => {
        setLocationError("Location access denied. Please allow location.");
        setLocationLoading(false);
        const fallback = { lat: 13.0827, lng: 80.2707 };
        setYourLocation(fallback);
        setMapCenter(fallback);
        const shop = { lat: 13.096, lng: 80.2817 };
        setShopLocation(shop);
        setDeliveryPos(shop);
        setDistanceMeters(calcDistanceMeters(shop, fallback));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update distance display every tick
  useEffect(() => {
    if (deliveryPos && yourLocation) {
      const dist = calcDistanceMeters(deliveryPos, yourLocation);
      setDistanceMeters(dist);
    }
  }, [deliveryPos, yourLocation]);

  // Fetch order
  useEffect(() => {
    if (!orderId || orderId === ":orderId") return;
    supabase
      .from("Order")
      .select("*, items:OrderItem(*, product:productId(name, images, price))")
      .eq("id", orderId)
      .single()
      .then(({ data }) => {
        setOrder(data);
        if (data?.status === "delivered") setOtpVerified(true);
      });
  }, [orderId]);

  // Handle OTP verify
  const handleOtpVerify = async () => {
    if (!order?.deliveryOtp) {
      setOtpError("No OTP found for this order.");
      return;
    }
    if (otpInput === order.deliveryOtp) {
      await supabase
        .from("Order")
        .update({ status: "delivered", otpVerified: true })
        .eq("id", orderId);
      setOtpVerified(true);
      setShowOtpPopup(false);
      setOtpError("");
      // Show rating after 1 second
      setTimeout(() => setShowRating(true), 1000);
    } else {
      setOtpError("Wrong OTP. Please check your email.");
    }
  };

  // Submit rating
  const handleRatingSubmit = async () => {
    await supabase
      .from("Order")
      .update({
        productRating,
        deliveryRating,
        ratingComment,
      })
      .eq("id", orderId);
    setRatingSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f0e9" }}>
      {/* OTP POPUP — appears when delivery arrives */}
      {showOtpPopup && !otpVerified && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🚚</div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.6rem",
                color: "#0d4d4d",
                margin: "0 0 8px",
              }}
            >
              Delivery Partner Arrived!
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#6b7280",
                fontFamily: "Montserrat, sans-serif",
                margin: "0 0 24px",
                lineHeight: "1.6",
              }}
            >
              Enter the 6-digit OTP sent to your email to confirm receipt of
              your jewellery
            </p>

            <input
              type="text"
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
              style={{
                width: "100%",
                padding: "16px",
                border: `2px solid ${otpError ? "#fca5a5" : "rgba(13,77,77,0.2)"}`,
                borderRadius: "8px",
                fontSize: "1.6rem",
                fontFamily: "monospace",
                letterSpacing: "8px",
                fontWeight: "900",
                textAlign: "center",
                outline: "none",
                marginBottom: "12px",
                boxSizing: "border-box",
              }}
            />

            {otpError && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "0.78rem",
                  fontFamily: "Montserrat, sans-serif",
                  margin: "0 0 12px",
                }}
              >
                ❌ {otpError}
              </p>
            )}

            <button
              onClick={handleOtpVerify}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#0d4d4d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                marginBottom: "10px",
              }}
            >
              CONFIRM DELIVERY
            </button>
            <button
              onClick={() => setShowOtpPopup(false)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#9ca3af",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Enter OTP later
            </button>
          </div>
        </div>
      )}

      {/* RATING POPUP — appears after OTP verified */}
      {showRating && !ratingSubmitted && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🎉</div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.6rem",
                color: "#0d4d4d",
                margin: "0 0 4px",
              }}
            >
              Order Delivered!
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#6b7280",
                fontFamily: "Montserrat, sans-serif",
                margin: "0 0 24px",
              }}
            >
              How was your JewelsNow experience?
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <StarRating
                rating={productRating}
                onRate={setProductRating}
                label="Rate the Jewellery"
              />
              <StarRating
                rating={deliveryRating}
                onRate={setDeliveryRating}
                label="Rate the Delivery"
              />
            </div>

            <textarea
              placeholder="Write a review (optional)..."
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid rgba(13,77,77,0.2)",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontFamily: "Montserrat, sans-serif",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
                marginBottom: "16px",
              }}
            />

            <button
              onClick={handleRatingSubmit}
              disabled={productRating === 0 || deliveryRating === 0}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor:
                  productRating === 0 || deliveryRating === 0
                    ? "#9ca3af"
                    : "#d4af37",
                color: "#0d4d4d",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: "700",
                letterSpacing: "1px",
                cursor: productRating === 0 ? "not-allowed" : "pointer",
                fontFamily: "Montserrat, sans-serif",
                marginBottom: "8px",
              }}
            >
              SUBMIT RATING ✨
            </button>
            <button
              onClick={() => setShowRating(false)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#9ca3af",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* Rating submitted success */}
      {ratingSubmitted && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "40px 32px",
              maxWidth: "360px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>⭐</div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.6rem",
                color: "#0d4d4d",
                margin: "0 0 8px",
              }}
            >
              Thank You!
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#6b7280",
                fontFamily: "Montserrat, sans-serif",
                margin: "0 0 20px",
              }}
            >
              Your rating helps us improve. We're glad you chose JewelsNow! 💍
            </p>
            <button
              onClick={() => {
                setRatingSubmitted(false);
                navigate("/collections");
              }}
              style={{
                padding: "12px 28px",
                backgroundColor: "#0d4d4d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              SHOP AGAIN →
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#0d4d4d",
          padding: isMobile ? "20px 24px" : "24px 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate(-1)}
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
            Live Track Order
          </h1>
        </div>
        {order && (
          <span
            style={{
              color: "#d4af37",
              fontSize: "0.72rem",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "700",
              letterSpacing: "1px",
            }}
          >
            #{order.id?.slice(0, 8).toUpperCase()}
          </span>
        )}
      </div>

      {locationError && (
        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #fbbf24",
            padding: "12px 24px",
            fontSize: "0.82rem",
            color: "#92400e",
            fontFamily: "Montserrat, sans-serif",
            textAlign: "center",
          }}
        >
          ⚠️ {locationError}
        </div>
      )}

      <div style={{ padding: isMobile ? "20px 16px" : "32px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 360px",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* ETA / Arrived Banner */}
            <div
              style={{
                backgroundColor: deliveryArrived ? "#16a34a" : "#0d4d4d",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
                transition: "background 0.5s",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "Montserrat, sans-serif",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  {deliveryArrived ? "Status" : "Delivery Partner Distance"}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: "#d4af37",
                    fontFamily: "Cormorant Garamond, serif",
                  }}
                >
                  {deliveryArrived
                    ? "🎉 Arrived at your door!"
                    : formatDistance(distanceMeters)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Delivery partner
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "white",
                    fontWeight: "600",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {deliveryAgent.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {deliveryAgent.vehicle}
                </p>
              </div>
            </div>

            {/* MAP */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid rgba(13,77,77,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#0d4d4d",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Live Map
                </h3>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: otpVerified ? "#d4af37" : "#22c55e",
                      animation: otpVerified ? "none" : "pulse 1.5s infinite",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: otpVerified ? "#d4af37" : "#16a34a",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {otpVerified ? "DELIVERED" : "LIVE"}
                  </span>
                </div>
              </div>

              {locationLoading ? (
                <div
                  style={{
                    height: "350px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
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
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "0.82rem",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Getting your location...
                  </p>
                </div>
              ) : (
                <div style={{ height: isMobile ? "300px" : "400px" }}>
                  <MapContainer
                    center={[
                      mapCenter?.lat || 13.0827,
                      mapCenter?.lng || 80.2707,
                    ]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mapCenter && (
                      <MapController center={[mapCenter.lat, mapCenter.lng]} />
                    )}
                    {yourLocation && (
                      <Marker
                        position={[yourLocation.lat, yourLocation.lng]}
                        icon={youIcon}
                      >
                        <Popup>
                          <strong>📍 Your Location</strong>
                          <br />
                          Delivery arrives here
                        </Popup>
                      </Marker>
                    )}
                    {yourLocation && (
                      <Circle
                        center={[yourLocation.lat, yourLocation.lng]}
                        radius={80}
                        pathOptions={{
                          color: "#0d4d4d",
                          fillColor: "#0d4d4d",
                          fillOpacity: 0.05,
                        }}
                      />
                    )}
                    {shopLocation && (
                      <Marker
                        position={[shopLocation.lat, shopLocation.lng]}
                        icon={shopIcon}
                      >
                        <Popup>
                          <strong>💍 JewelsNow Store</strong>
                          <br />
                          Dispatched from here
                        </Popup>
                      </Marker>
                    )}
                    {deliveryPos && (
                      <Marker
                        position={[deliveryPos.lat, deliveryPos.lng]}
                        icon={deliveryIcon}
                      >
                        <Popup>
                          <strong>🚚 {deliveryAgent.name}</strong>
                          <br />
                          {formatDistance(distanceMeters)}
                        </Popup>
                      </Marker>
                    )}
                    {shopLocation && deliveryPos && yourLocation && (
                      <Polyline
                        positions={[
                          [shopLocation.lat, shopLocation.lng],
                          [deliveryPos.lat, deliveryPos.lng],
                          [yourLocation.lat, yourLocation.lng],
                        ]}
                        pathOptions={{
                          color: "#0d4d4d",
                          weight: 3,
                          dashArray: "8 4",
                          opacity: 0.7,
                        }}
                      />
                    )}
                  </MapContainer>
                </div>
              )}

              <div
                style={{
                  padding: "10px 16px",
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  borderTop: "1px solid rgba(13,77,77,0.06)",
                  backgroundColor: "#fafaf9",
                }}
              >
                {[
                  { icon: "📍", label: "You" },
                  { icon: "🚚", label: "Delivery" },
                  { icon: "💍", label: "JewelsNow Store" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.72rem",
                      color: "#6b7280",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AGENT CARD */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "18px 20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#0d4d4d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    flexShrink: 0,
                  }}
                >
                  👨
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: "0.88rem",
                      fontWeight: "700",
                      color: "#0d4d4d",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {deliveryAgent.name}
                  </p>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: "0.72rem",
                      color: "#6b7280",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    🚚 {deliveryAgent.vehicle}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.72rem",
                      color: deliveryArrived ? "#16a34a" : "#d4af37",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {deliveryArrived
                      ? "✅ At your location"
                      : formatDistance(distanceMeters)}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() =>
                    (window.location.href = `tel:${deliveryAgent.phone}`)
                  }
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#0d4d4d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <Phone size={14} /> Call
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/${deliveryAgent.phone}?text=Hi, tracking order ${orderId?.slice(0, 8)}`,
                      "_blank",
                    )
                  }
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#25d366",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <MessageCircle size={14} /> WhatsApp
                </button>
              </div>
            </div>

            {/* MANUAL OTP — show if arrived but popup was dismissed */}
            {deliveryArrived && !otpVerified && !showOtpPopup && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: "2px solid #d4af37",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.1rem",
                    color: "#0d4d4d",
                    margin: "0 0 8px",
                  }}
                >
                  🔐 Confirm Delivery with OTP
                </h3>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    fontFamily: "Montserrat, sans-serif",
                    margin: "0 0 14px",
                  }}
                >
                  Enter the 6-digit OTP from your email
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="_ _ _ _ _ _"
                    value={otpInput}
                    onChange={(e) =>
                      setOtpInput(e.target.value.replace(/\D/g, ""))
                    }
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      border: `1px solid ${otpError ? "#fca5a5" : "rgba(13,77,77,0.2)"}`,
                      borderRadius: "6px",
                      fontSize: "1.2rem",
                      fontFamily: "monospace",
                      letterSpacing: "6px",
                      fontWeight: "700",
                      textAlign: "center",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleOtpVerify}
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#0d4d4d",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    VERIFY
                  </button>
                </div>
                {otpError && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "0.72rem",
                      margin: "8px 0 0",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    ❌ {otpError}
                  </p>
                )}
              </div>
            )}

            {/* DELIVERED SUCCESS */}
            {otpVerified && (
              <div
                style={{
                  backgroundColor: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: "12px",
                  padding: "24px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
                  🎉
                </div>
                <h3
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.4rem",
                    color: "#0d4d4d",
                    margin: "0 0 6px",
                  }}
                >
                  Order Delivered Successfully!
                </h3>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#16a34a",
                    fontFamily: "Montserrat, sans-serif",
                    margin: "0 0 16px",
                  }}
                >
                  OTP verified ✓ • Your jewellery has been delivered
                </p>
                {!showRating && (
                  <button
                    onClick={() => setShowRating(true)}
                    style={{
                      padding: "10px 24px",
                      backgroundColor: "#d4af37",
                      color: "#0d4d4d",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    ⭐ Rate Your Experience
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — Status + Items + Help */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Order Status */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 20px",
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.2rem",
                  color: "#0d4d4d",
                  fontWeight: "700",
                }}
              >
                Order Status
              </h3>
              {orderStatuses.map((status, i, arr) => (
                <div
                  key={status.label}
                  style={{ display: "flex", gap: "14px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: status.done
                          ? "#d4af37"
                          : "rgba(13,77,77,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {status.done ? (
                        <span style={{ color: "#0d4d4d", fontSize: "0.8rem" }}>
                          ✓
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "#9ca3af",
                            fontSize: "0.7rem",
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
                          height: "32px",
                          backgroundColor: status.done
                            ? "#d4af37"
                            : "rgba(13,77,77,0.08)",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{ paddingBottom: i < arr.length - 1 ? "12px" : "0" }}
                  >
                    <p
                      style={{
                        margin: "2px 0 2px",
                        fontSize: "0.82rem",
                        fontWeight: status.active ? "700" : "500",
                        color: status.done ? "#0d4d4d" : "#9ca3af",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {status.label}
                      {status.active && (
                        <span
                          style={{
                            marginLeft: "8px",
                            backgroundColor: "rgba(34,197,94,0.1)",
                            color: "#16a34a",
                            fontSize: "0.6rem",
                            fontWeight: "700",
                            padding: "2px 6px",
                            borderRadius: "999px",
                          }}
                        >
                          LIVE
                        </span>
                      )}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.68rem",
                        color: "#9ca3af",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {status.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Items */}
            {order?.items && order.items.length > 0 && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 14px",
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.2rem",
                    color: "#0d4d4d",
                    fontWeight: "700",
                  }}
                >
                  Your Items
                </h3>
                {order.items.map((item) => (
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
                      src={item.product?.images?.[0]}
                      alt={item.product?.name}
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
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8rem",
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
                          fontSize: "0.68rem",
                          color: "#9ca3af",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        Qty: {item.quantity} × ₹
                        {item.product?.price?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
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
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#0d4d4d",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
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

            {/* Help */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px 18px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#0d4d4d",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "600",
                }}
              >
                Need help with your order?
              </p>
              <button
                style={{
                  padding: "8px 14px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(13,77,77,0.2)",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#0d4d4d",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); }}
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default TrackOrder;
