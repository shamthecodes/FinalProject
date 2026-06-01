import React, { useState, useEffect } from "react";

const shopLinks = [
  "All Jewelry",
  "Rings",
  "Earrings",
  "Necklaces",
  "Bracelets",
  "Bangles",
];
const collectionsLinks = [
  "Bridal",
  "Diamond",
  "Gold",
  "New Arrivals",
  "Men's",
  "Pendants",
];
const aboutLinks = [
  "Our Story",
  "Craftsmanship",
  "Sustainability",
  "Careers",
  "Press",
  "Contact",
];

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <footer style={{ backgroundColor: "#0d4d4d", color: "#fff" }}>
      {/* NEWSLETTER BAR */}
      <div
        style={{
          borderBottom: "1px solid rgba(212,175,55,0.2)",
          padding: isMobile ? "32px 24px" : "40px 80px",
          display: "flex",
          // flexDirection: isMobile ? "column" : "row",

          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "24px",
          flexDirection: "column",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: isMobile ? "1.2rem" : "1.4rem",
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: "600",
              color: "white",
            }}
          >
            JOIN OUR EXCLUSIVE CLUB
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Get early access to new collections & exclusive offers.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0",
            width: isMobile ? "100%" : "400px",
          }}
        ></div>
      </div>

      {/* MAIN LINKS */}
      <div
        style={{
          padding: isMobile ? "40px 24px" : "60px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: isMobile ? "40px 24px" : "60px",
        }}
      >
        {/* SHOP */}
        <div>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.65rem",
              fontWeight: "700",
              letterSpacing: "4px",
              color: "#d4af37",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            SHOP
          </p>
          {shopLinks.map((link) => (
            <div key={link} style={{ marginBottom: "10px" }}>
              <a
                href="#"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "300",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#d4af37")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.65)")
                }
              >
                {link}
              </a>
            </div>
          ))}
        </div>

        {/* COLLECTIONS */}
        <div>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.65rem",
              fontWeight: "700",
              letterSpacing: "4px",
              color: "#d4af37",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            COLLECTIONS
          </p>
          {collectionsLinks.map((link) => (
            <div key={link} style={{ marginBottom: "10px" }}>
              <a
                href="#"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "300",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#d4af37")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.65)")
                }
              >
                {link}
              </a>
            </div>
          ))}
        </div>

        {/* ABOUT */}
        <div>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.65rem",
              fontWeight: "700",
              letterSpacing: "4px",
              color: "#d4af37",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            ABOUT US
          </p>
          {aboutLinks.map((link) => (
            <div key={link} style={{ marginBottom: "10px" }}>
              <a
                href="#"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "300",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#d4af37")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.65)")
                }
              >
                {link}
              </a>
            </div>
          ))}
        </div>

        {/* FOLLOW + BRAND */}
        <div>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.65rem",
              fontWeight: "700",
              letterSpacing: "4px",
              color: "#d4af37",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            FOLLOW US
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
            {["f", "in", "P"].map((icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid rgba(212,175,55,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#d4af37";
                  e.currentTarget.style.color = "#0d4d4d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "white";
                }}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Brand */}
          <div
            style={{
              borderTop: "1px solid rgba(212,175,55,0.2)",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                color: "#d4af37",
                marginBottom: "8px",
              }}
            >
              ✿
            </div>
            <h3
              style={{
                margin: "0 0 6px",
                fontSize: "1.4rem",
                fontStyle: "italic",
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: "600",
                color: "white",
              }}
            >
              Timeless Elegance
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.55rem",
                letterSpacing: "3px",
                color: "#d4af37",
                textTransform: "uppercase",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Since Forever
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: isMobile ? "20px 24px" : "24px 80px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          © {new Date().getFullYear()} JewelsNow. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
            (item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  fontFamily: "Montserrat, sans-serif",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#d4af37")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.4)")
                }
              >
                {item}
              </a>
            ),
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
