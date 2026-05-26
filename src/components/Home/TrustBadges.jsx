import React, { useState, useEffect } from "react";

const badges = [
  {
    icon: "/images/badges/diamond.png",
    title: "Certified Diamonds",
    desc: "Hallmarked & Certified Jewelry",
  },
  {
    icon: "/images/badges/exchange.png",
    title: "Lifetime Exchange",
    desc: "Exchange Anytime, Anywhere",
  },
  {
    icon: "/images/badges/secure.png",
    title: "Secure Payment",
    desc: "100% Safe & Secure Transactions",
  },
  {
    icon: "/images/badges/shipping.png",
    title: "Free Shipping",
    desc: "On Orders Above ₹1999",
  },
  {
    icon: "/images/badges/returns.png",
    title: "Easy Returns",
    desc: "15 Days Easy Return Policy",
  },
  {
    icon: "/images/badges/craft.png",
    title: "Crafted with Excellence",
    desc: "Detailing in Every Piece",
  },
];

// fallback emojis if images not found
const fallbackEmojis = ["💎", "🔄", "🔒", "🚚", "↩️", "✨"];

const TrustBadges = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      style={{
        backgroundColor: "white",
        padding: isMobile ? "32px 16px" : "40px 80px",
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)",
        gap: isMobile ? "20px" : "24px",
        borderTop: "1px solid rgba(13,77,77,0.08)",
        borderBottom: "1px solid rgba(13,77,77,0.08)",
      }}
    >
      {badges.map((badge, i) => (
        <div
          key={badge.title}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "40px",
              height: "40px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
            }}
          >
            <img
              src={badge.icon}
              alt={badge.title}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerText = fallbackEmojis[i];
              }}
            />
          </div>

          {/* Text */}
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: "700",
                color: "#0d4d4d",
                margin: "0 0 2px",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {badge.title}
            </p>
            <p
              style={{
                fontSize: "0.62rem",
                color: "#6b7280",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              {badge.desc}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default TrustBadges;
