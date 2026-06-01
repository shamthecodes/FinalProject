import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { Sparkles } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";

const categories = [
  "All",
  "Rings",
  "Earrings",
  "Necklaces",
  "Bracelets",
  "Bangles",
  "Pendants",
  "Bridal Sets",
];
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Price: High to Low", value: "price_high" },
];

const Collections = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({
    category: category || "",
    sort: "newest",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: category || "" }));
  }, [category]);

  const { products, loading } = useProducts(filters);

  const updateSort = (value) => {
    setSort(value);
    setFilters((prev) => ({ ...prev, sort: value }));
  };

  const updateCategory = (cat) => {
    setFilters((prev) => ({ ...prev, category: cat === "All" ? "" : cat }));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f0e9" }}>
      {/* PAGE HEADER */}
      <div
        style={{
          backgroundColor: "#0d4d4d",
          padding: isMobile ? "40px 24px 32px" : "60px 80px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            border: "50px solid rgba(212,175,55,0.06)",
            top: "-100px",
            right: "-100px",
          }}
        />

        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "4px",
            color: "#d4af37",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Our Collection
        </span>

        <h1
          style={{
            fontSize: isMobile ? "2rem" : "3rem",
            fontWeight: "700",
            color: "white",
            margin: "8px 0 0",
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          {filters.category || "All Jewellery"}
        </h1>

        {/* AI TRY-ON BANNER */}
        <div
          onClick={() => navigate("/try-on")}
          style={{
            marginTop: "24px",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "rgba(212,175,55,0.15)",
            border: "1px solid rgba(212,175,55,0.4)",
            borderRadius: "8px",
            padding: isMobile ? "10px 16px" : "12px 24px",
            cursor: "pointer",
          }}
        >
          <Sparkles size={18} color="#d4af37" />
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                fontWeight: "700",
                color: "#d4af37",
                letterSpacing: "1px",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              ✨ AI VIRTUAL TRY-ON
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Upload your photo + jewellery → See realistic preview
            </p>
          </div>
          {!isMobile && (
            <div
              style={{
                backgroundColor: "#d4af37",
                color: "#0d4d4d",
                padding: "6px 14px",
                borderRadius: "4px",
                fontSize: "0.65rem",
                fontWeight: "700",
                letterSpacing: "1px",
                fontFamily: "Montserrat, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              TRY NOW →
            </div>
          )}
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div
        style={{
          backgroundColor: "white",
          padding: isMobile ? "0 16px" : "0 80px",
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none",
          borderBottom: "1px solid rgba(13,77,77,0.08)",
          position: "sticky",
          top: "0",
          zIndex: 50,
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateCategory(cat)}
            style={{
              padding: "16px 20px",
              border: "none",
              borderBottom: `2px solid ${
                (cat === "All" && !filters.category) || filters.category === cat
                  ? "#0d4d4d"
                  : "transparent"
              }`,
              backgroundColor: "transparent",
              color:
                (cat === "All" && !filters.category) || filters.category === cat
                  ? "#0d4d4d"
                  : "#6b7280",
              fontSize: "0.72rem",
              fontWeight: "600",
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.2s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div style={{ padding: isMobile ? "24px 16px" : "40px 80px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontSize: "0.82rem",
              color: "#6b7280",
              fontFamily: "Montserrat, sans-serif",
              margin: 0,
            }}
          >
            {loading ? "Loading..." : `${products.length} products`}
          </p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateSort(opt.value)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "999px",
                  border: `1px solid ${sort === opt.value ? "#0d4d4d" : "#e5e7eb"}`,
                  backgroundColor: sort === opt.value ? "#0d4d4d" : "white",
                  color: sort === opt.value ? "white" : "#6b7280",
                  fontSize: "0.72rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
};

export default Collections;
