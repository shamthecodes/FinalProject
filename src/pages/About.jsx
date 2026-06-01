import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Award, Truck, RefreshCw, Heart, Star } from "lucide-react";

const About = () => {
  const navigate = useNavigate();
  const [isMobile] = useState(window.innerWidth < 768);

  const values = [
    {
      icon: <Shield size={24} />,
      title: "Certified & Hallmarked",
      desc: "Every piece is BIS hallmarked and certified for purity. We never compromise on quality.",
    },
    {
      icon: <Award size={24} />,
      title: "Master Craftsmen",
      desc: "Our jewellery is handcrafted by skilled artisans with decades of experience.",
    },
    {
      icon: <Truck size={24} />,
      title: "Free Delivery",
      desc: "Free shipping across India on all orders above ₹1999. Delivered safely to your door.",
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Lifetime Exchange",
      desc: "Bring back any JewelsNow piece anytime for exchange. No questions asked.",
    },
    {
      icon: <Heart size={24} />,
      title: "Made with Love",
      desc: "Each piece tells a story. We create jewellery that becomes part of your story.",
    },
    {
      icon: <Star size={24} />,
      title: "10,000+ Happy Customers",
      desc: "Trusted by thousands of families across India for their most special moments.",
    },
  ];

  const team = [
    {
      name: "Priya Menon",
      role: "Founder & Head Designer",
      emoji: "👩",
      desc: "20 years of jewellery design experience",
    },
    {
      name: "Arjun Sharma",
      role: "Master Goldsmith",
      emoji: "👨",
      desc: "Award-winning craftsman from Jaipur",
    },
    {
      name: "Kavya Nair",
      role: "Customer Relations Head",
      emoji: "👩",
      desc: "Ensuring every customer feels special",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f0e9" }}>
      {/* HERO */}
      <div
        style={{
          backgroundColor: "#0d4d4d",
          padding: isMobile ? "60px 24px" : "80px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
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
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            border: "40px solid rgba(212,175,55,0.04)",
            bottom: "-100px",
            left: "-80px",
          }}
        />

        <p
          style={{
            color: "#d4af37",
            fontSize: "0.7rem",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
            margin: "0 0 12px",
          }}
        >
          Our Story
        </p>
        <h1
          style={{
            fontSize: isMobile ? "2.4rem" : "3.5rem",
            fontWeight: "700",
            color: "white",
            margin: "0 0 16px",
            fontFamily: "Cormorant Garamond, serif",
            lineHeight: "1.2",
          }}
        >
          Jewels in Trice
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1rem",
            margin: "0 auto",
            maxWidth: "560px",
            lineHeight: "1.9",
            fontWeight: "300",
          }}
        >
          We believe every woman deserves to feel like royalty. JewelsNow brings
          you handcrafted fine jewellery that combines timeless tradition with
          modern elegance.
        </p>
      </div>

      {/* STORY SECTION */}
      <div
        style={{
          padding: isMobile ? "48px 24px" : "72px 80px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "60px",
          alignItems: "center",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: "#d4af37",
              fontSize: "0.65rem",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontFamily: "Montserrat, sans-serif",
              margin: "0 0 12px",
            }}
          >
            Est. 2018
          </p>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: isMobile ? "2rem" : "2.6rem",
              color: "#0d4d4d",
              margin: "0 0 20px",
              fontWeight: "700",
              lineHeight: "1.3",
            }}
          >
            A Passion for Craftsmanship
          </h2>
          <p
            style={{
              color: "#6b7280",
              lineHeight: "1.9",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.9rem",
              fontWeight: "300",
              margin: "0 0 16px",
            }}
          >
            JewelsNow was born from a simple dream — to make fine jewellery
            accessible to every Indian household without compromising on quality
            or craftsmanship. Founded in Chennai in 2018, we started with a
            small workshop and a team of three passionate artisans.
          </p>
          <p
            style={{
              color: "#6b7280",
              lineHeight: "1.9",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.9rem",
              fontWeight: "300",
              margin: "0 0 24px",
            }}
          >
            Today, we serve over 10,000 families across India. Every ring,
            necklace, bangle and earring that leaves our workshop carries the
            promise of purity, the artistry of our master craftsmen, and the joy
            of a moment made forever.
          </p>
          <button
            onClick={() => navigate("/collections")}
            style={{
              padding: "14px 32px",
              backgroundColor: "#0d4d4d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: "700",
              letterSpacing: "2px",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              textTransform: "uppercase",
            }}
          >
            EXPLORE COLLECTION →
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            flexShrink: 0,
          }}
        >
          {[
            { number: "10,000+", label: "Happy Customers" },
            { number: "500+", label: "Unique Designs" },
            { number: "7", label: "Years of Trust" },
            { number: "100%", label: "Certified Gold" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px 20px",
                textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#d4af37",
                  margin: "0 0 4px",
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                {stat.number}
              </p>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  margin: 0,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* VALUES */}
      <div
        style={{
          backgroundColor: "#0d4d4d",
          padding: isMobile ? "48px 24px" : "72px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              color: "#d4af37",
              fontSize: "0.65rem",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontFamily: "Montserrat, sans-serif",
              margin: "0 0 12px",
            }}
          >
            Why Choose Us
          </p>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: isMobile ? "2rem" : "2.6rem",
              color: "white",
              margin: 0,
              fontWeight: "700",
            }}
          >
            Our Promise to You
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "24px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {values.map((val) => (
            <div
              key={val.title}
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                padding: "28px 24px",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.09)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.05)")
              }
            >
              <div
                style={{
                  color: "#d4af37",
                  marginBottom: "14px",
                  width: "44px",
                  height: "44px",
                  backgroundColor: "rgba(212,175,55,0.15)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {val.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.2rem",
                  color: "white",
                  margin: "0 0 8px",
                  fontWeight: "700",
                }}
              >
                {val.title}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.82rem",
                  lineHeight: "1.7",
                  fontWeight: "300",
                  margin: 0,
                }}
              >
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM */}
      <div
        style={{
          padding: isMobile ? "48px 24px" : "72px 80px",
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <p
          style={{
            color: "#d4af37",
            fontSize: "0.65rem",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
            margin: "0 0 12px",
          }}
        >
          The People Behind JewelsNow
        </p>
        <h2
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: isMobile ? "2rem" : "2.6rem",
            color: "#0d4d4d",
            margin: "0 0 40px",
            fontWeight: "700",
          }}
        >
          Meet Our Team
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "28px",
            maxWidth: "900px",
            margin: "0 auto 48px",
          }}
        >
          {team.map((member) => (
            <div
              key={member.name}
              style={{
                backgroundColor: "#f7f0e9",
                borderRadius: "12px",
                padding: "32px 24px",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "12px",
                  width: "72px",
                  height: "72px",
                  backgroundColor: "#0d4d4d",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                {member.emoji}
              </div>
              <h3
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.2rem",
                  color: "#0d4d4d",
                  margin: "0 0 4px",
                  fontWeight: "700",
                }}
              >
                {member.name}
              </h3>
              <p
                style={{
                  color: "#d4af37",
                  fontSize: "0.7rem",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                }}
              >
                {member.role}
              </p>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "300",
                  margin: 0,
                }}
              >
                {member.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            backgroundColor: "#0d4d4d",
            borderRadius: "16px",
            padding: isMobile ? "32px 24px" : "48px",
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.8rem",
              color: "white",
              margin: "0 0 12px",
            }}
          >
            Start Your Jewellery Journey
          </h3>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.85rem",
              margin: "0 0 24px",
              lineHeight: "1.8",
            }}
          >
            Explore our curated collection and find the perfect piece that
            speaks to your heart.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/collections")}
              style={{
                padding: "14px 28px",
                backgroundColor: "#d4af37",
                color: "#0d4d4d",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.78rem",
                fontWeight: "700",
                letterSpacing: "1px",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              SHOP NOW →
            </button>
            <button
              onClick={() => navigate("/try-on")}
              style={{
                padding: "14px 28px",
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "6px",
                fontSize: "0.78rem",
                fontWeight: "600",
                letterSpacing: "1px",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              ✨ AI TRY-ON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
