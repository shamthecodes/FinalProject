import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CategoryIcons from "@/components/Home/Category";
import FeaturedCollections from "@/components/Home/FeaturedCollections";
import TrustBadges from "@/components/Home/TrustBadges";

const slides = [
  {
    id: 1,
    label: "New Collection 2025",
    title: "Timeless Beauty,Crafted to Perfection",
    desc: "Discover our exquisite collection of fine jewelry crafted with passion and precision.",
    image: "/images/hero1.png",
  },
  {
    id: 2,
    label: "Bridal Collection",
    title: "Your Perfect\nWedding Jewellery",
    desc: "Celebrate your special moments with our royal bridal designs.",
    image: "/images/hero-2.png",
  },
  {
    id: 3,
    label: "Diamond Collection",
    title: "Unmatched Brilliance,\nCrafted to Perfection",
    desc: "Experience the finest certified diamonds in every piece.",
    image: "/images/hero-3.png",
  },
];

const Hero = () => {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* AUTO SLIDE */
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* MOBILE DETECTION */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <section
        style={{
          width: "100%",
          height: isMobile ? "100svh" : "88vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          background: "#0d4d4d",
        }}
      >
        {/* ========================= */}
        {/* DESKTOP IMAGE */}
        {/* ========================= */}

        {!isMobile && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "72%",
              height: "100%",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {/* BLEND OVERLAY */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                background:
                  "linear-gradient(to right, rgba(13,77,77,1) 0%, rgba(13,77,77,0.82) 10%, rgba(13,77,77,0.4) 22%, rgba(13,77,77,0) 35%)",
              }}
            />

            <img
              src={slides[active].image}
              alt="Luxury Jewellery"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transition: "all 0.6s ease",
                transform: "scale(1.02)",
              }}
            />
          </div>
        )}

        {/* ========================= */}
        {/* MOBILE BACKGROUND IMAGE */}
        {/* ========================= */}

        {isMobile && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
            }}
          >
            <img
              src={slides[active].image}
              alt="Luxury Jewellery"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            {/* MOBILE OVERLAY */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(13,77,77,0.45) 0%, rgba(13,77,77,0.7) 55%, rgba(13,77,77,0.96) 100%)",
              }}
            />
          </div>
        )}

        {/* ========================= */}
        {/* LEFT CONTENT */}
        {/* ========================= */}

        <div
          style={{
            width: isMobile ? "100%" : "45%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: isMobile ? "flex-end" : "center",
            padding: isMobile ? "40px 24px 90px" : "0 70px",
            position: "relative",
            zIndex: 5,
          }}
        >
          {/* DECORATIVE CIRCLE */}
          <div
            style={{
              position: "absolute",
              width: isMobile ? "220px" : "340px",
              height: isMobile ? "220px" : "340px",
              borderRadius: "50%",
              border: "55px solid rgba(212,175,55,0.05)",
              bottom: isMobile ? "-120px" : "-120px",
              left: isMobile ? "-120px" : "-150px",
            }}
          />

          {/* CONTENT */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "22px",
            }}
          >
            {/* BADGE */}
            <Badge
              style={{
                width: "fit-content",
                background: "rgba(212,175,55,0.12)",
                border: "1px solid rgba(212,175,55,0.35)",
                color: "#d4af37",
                padding: "5px 14px",
                borderRadius: "999px",
                fontSize: "0.68rem",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontWeight: "500",
              }}
            >
              ✦ {slides[active].label}
            </Badge>

            {/* HEADING */}
            <h1
              style={{
                margin: 0,
                color: "#fff",
                whiteSpace: "pre-line",
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: "700",
                fontSize: isMobile ? "2.2rem" : "3.2rem", // ← changed from 5rem to 3.2rem
                lineHeight: isMobile ? "1.15" : "1.1",
                letterSpacing: "-0.5px",
                maxWidth: "520px",
                textShadow: "0 4px 18px rgba(0,0,0,0.25)",
              }}
            >
              {slides[active].title}
            </h1>

            {/* DESCRIPTION */}
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.78)",
                fontSize: isMobile ? "0.95rem" : "1rem",
                lineHeight: "1.9",
                maxWidth: "470px",
                fontWeight: "300",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {slides[active].desc}
            </p>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "10px",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Button
                style={{
                  background: "#d4af37",
                  color: "#0d4d4d",
                  border: "none",
                  borderRadius: "4px",
                  padding: "15px 32px",
                  fontSize: "0.74rem",
                  letterSpacing: "2px",
                  fontWeight: "700",
                  height: "auto",
                  width: isMobile ? "100%" : "fit-content",
                }}
              >
                EXPLORE COLLECTION →
              </Button>

              <Button
                style={{
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "4px",
                  padding: "15px 32px",
                  fontSize: "0.74rem",
                  letterSpacing: "2px",
                  fontWeight: "700",
                  height: "auto",
                  width: isMobile ? "100%" : "fit-content",
                }}
              >
                VIEW BRIDAL
              </Button>
            </div>
          </div>

          {/* SLIDER DOTS */}
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? "35px" : "45px",
              left: isMobile ? "24px" : "70px",
              display: "flex",
              gap: "10px",
              zIndex: 10,
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: i === active ? "34px" : "10px",
                  height: "10px",
                  borderRadius: i === active ? "999px" : "50%",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                  background:
                    i === active ? "#d4af37" : "rgba(255,255,255,0.45)",
                }}
              />
            ))}
          </div>
        </div>
      </section>
      <CategoryIcons />
      <FeaturedCollections />
      <TrustBadges />
    </>
  );
};

export default Hero;
