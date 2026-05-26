import React, { useState, useEffect } from "react";

const collections = [
  {
    id: 1,
    title: "New Arrival",
    desc: "Modern designs for the modern you.",
    bg: "#f7f0e9",
    textColor: "#0d4d4d",
    btnText: "SHOP NOW →",
    image: "/images/new-arrival.png",
  },
  {
    id: 2,
    title: "Bridal Collection",
    desc: "Celebrate your special moments with our royal designs.",
    bg: "#0d4d4d",
    textColor: "white",
    btnText: "EXPLORE NOW →",
    image: "/images/bridal.png",
  },
  {
    id: 3,
    title: "Diamond Collection",
    desc: "Unmatched brilliance, crafted to perfection.",
    bg: "#f7f0e9",
    textColor: "#0d4d4d",
    btnText: "SHOP NOW →",
    image: "/images/diamond.png",
  },
];

const FeaturedCollections = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      style={{
        background: "#f7f3ee",
        padding: isMobile ? "20px" : "24px 40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr 1fr",
          gap: "16px",
        }}
      >
        {collections.map((col) => (
          <div
            key={col.id}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "10px",
              minHeight: isMobile ? "240px" : "300px",
              background: col.bg,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: isMobile ? "28px 22px" : "34px",
              cursor: "pointer",
            }}
          >
            {/* IMAGE */}
            <img
              src={col.image}
              alt={col.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: col.id === 2 ? "center" : "right center",
                zIndex: 0,
              }}
            />

            {/* OVERLAY */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  col.id === 2
                    ? "linear-gradient(90deg, rgba(13,77,77,0.96) 0%, rgba(13,77,77,0.88) 34%, rgba(13,77,77,0.15) 72%, rgba(13,77,77,0) 100%)"
                    : col.id === 1
                      ? "linear-gradient(90deg, rgba(247,240,233,0.98) 0%, rgba(247,240,233,0.92) 45%, rgba(247,240,233,0.2) 100%)"
                      : "linear-gradient(90deg, rgba(247,240,233,0.98) 0%, rgba(247,240,233,0.92) 45%, rgba(247,240,233,0.2) 100%)",
                zIndex: 1,
              }}
            />

            {/* CONTENT */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                maxWidth: "240px",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "1.8rem" : "2.1rem",
                  fontWeight: "600",
                  lineHeight: "1.1",
                  marginBottom: "14px",
                  color: col.textColor,
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                {col.title}
              </h3>

              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: "1.8",
                  color: col.id === 2 ? "rgba(255,255,255,0.82)" : "#4b5563",
                  margin: 0,
                }}
              >
                {col.desc}
              </p>
            </div>

            {/* BUTTON */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
              }}
            >
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  color: col.id === 2 ? "#ffffff" : "#0d4d4d",
                  fontSize: "0.74rem",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  cursor: "pointer",
                  padding: 0,
                  textTransform: "uppercase",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {/* {col.btnText} */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollections;
