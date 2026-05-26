import React from "react";

const categories = [
  { name: "Rings", image: "/images/categories/rings.png" },
  { name: "Errings", image: "/images/categories/errings.png" },
  { name: "Necklaces", image: "/images/categories/necklaces.png" },
  { name: "Bracelets", image: "/images/categories/bracelets.png" },
  { name: "Bangles", image: "/images/categories/bangles.png" },
  { name: "Pendants", image: "/images/categories/pendants.png" },
  { name: "Bridal Sets", image: "/images/categories/bridal-sets.png" },
  { name: "Men's Collection", image: "/images/categories/mens.png" },
];

const Category = () => {
  return (
    <section
      style={{
        backgroundColor: "#f7f0e9",
        padding: "40px 80px",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
    >
      {/* Inner wrapper — horizontal scroll on mobile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          minWidth: "max-content",
          width: "100%",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              minWidth: "80px",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {/* Image circle */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(212,175,55,0.3)",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.backgroundColor = "#0d4d4d";
                }}
              />
            </div>

            {/* Name */}
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: "600",
                color: "#0d4d4d",
                letterSpacing: "1px",
                textTransform: "uppercase",
                textAlign: "center",
                fontFamily: "Montserrat, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
