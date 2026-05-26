import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
const metals = ["All", "Gold", "Silver", "Platinum", "White Gold", "Rose Gold"];
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Price: High to Low", value: "price_high" },
];

const Collections = () => {
  const { category } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: category || "",
    metal: "",
    sort: "newest",
    search: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (category) setFilters((prev) => ({ ...prev, category }));
  }, [category]);

  const { products, loading } = useProducts(filters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setTimeout(() => updateFilter("search", e.target.value), 500);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f0e9" }}>
      {/* PAGE HEADER */}
      <div
        style={{
          backgroundColor: "#0d4d4d",
          padding: isMobile ? "40px 24px" : "60px 80px",
          textAlign: "center",
        }}
      >
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
            margin: "8px 0 16px",
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          {filters.category || "All Jewellery"}
        </h1>

        {/* SEARCH BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "400px",
            margin: "0 auto",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
            padding: "10px 16px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Search size={16} color="rgba(255,255,255,0.6)" />
          <input
            type="text"
            placeholder="Search jewellery..."
            value={search}
            onChange={handleSearch}
            style={{
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "0.85rem",
              width: "100%",
              fontFamily: "Montserrat, sans-serif",
            }}
          />
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div
        style={{
          backgroundColor: "white",
          padding: isMobile ? "0 16px" : "0 80px",
          display: "flex",
          gap: "0",
          overflowX: "auto",
          scrollbarWidth: "none",
          borderBottom: "1px solid rgba(13,77,77,0.08)",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilter("category", cat === "All" ? "" : cat)}
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

      {/* CONTENT */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          padding: isMobile ? "24px 16px" : "40px 80px",
        }}
      >
        {/* FILTER SIDEBAR — desktop only */}
        {!isMobile && (
          <div style={{ width: "220px", flexShrink: 0 }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                position: "sticky",
                top: "100px",
              }}
            >
              <h3
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  color: "#0d4d4d",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: "24px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                FILTERS
              </h3>

              {/* Metal */}
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    color: "#0d4d4d",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Metal
                </p>
                {metals.map((metal) => (
                  <div
                    key={metal}
                    onClick={() =>
                      updateFilter("metal", metal === "All" ? "" : metal)
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      backgroundColor:
                        filters.metal === metal ||
                        (metal === "All" && !filters.metal)
                          ? "rgba(13,77,77,0.08)"
                          : "transparent",
                      color:
                        filters.metal === metal ||
                        (metal === "All" && !filters.metal)
                          ? "#0d4d4d"
                          : "#6b7280",
                      fontSize: "0.82rem",
                      fontFamily: "Montserrat, sans-serif",
                      marginBottom: "2px",
                      transition: "all 0.2s",
                    }}
                  >
                    {metal}
                  </div>
                ))}
              </div>

              {/* Sort */}
              <div>
                <p
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    color: "#0d4d4d",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Sort By
                </p>
                {sortOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => updateFilter("sort", opt.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      backgroundColor:
                        filters.sort === opt.value
                          ? "rgba(13,77,77,0.08)"
                          : "transparent",
                      color: filters.sort === opt.value ? "#0d4d4d" : "#6b7280",
                      fontSize: "0.82rem",
                      fontFamily: "Montserrat, sans-serif",
                      marginBottom: "2px",
                      transition: "all 0.2s",
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        <div style={{ flex: 1 }}>
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
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

            {/* Mobile filter button */}
            {isMobile && (
              <button
                onClick={() => setShowFilter(!showFilter)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#0d4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.72rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                <SlidersHorizontal size={14} />
                FILTER
              </button>
            )}
          </div>

          {/* Mobile filter dropdown */}
          {isMobile && showFilter && (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontWeight: "700",
                    color: "#0d4d4d",
                    fontSize: "0.85rem",
                  }}
                >
                  Filters
                </span>
                <X
                  size={16}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowFilter(false)}
                />
              </div>

              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  color: "#0d4d4d",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Sort By
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateFilter("sort", opt.value)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      border: `1px solid ${filters.sort === opt.value ? "#0d4d4d" : "#e5e7eb"}`,
                      backgroundColor:
                        filters.sort === opt.value ? "#0d4d4d" : "white",
                      color: filters.sort === opt.value ? "white" : "#6b7280",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  color: "#0d4d4d",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Metal
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {metals.map((metal) => (
                  <button
                    key={metal}
                    onClick={() =>
                      updateFilter("metal", metal === "All" ? "" : metal)
                    }
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      border: `1px solid ${filters.metal === metal || (metal === "All" && !filters.metal) ? "#0d4d4d" : "#e5e7eb"}`,
                      backgroundColor:
                        filters.metal === metal ||
                        (metal === "All" && !filters.metal)
                          ? "#0d4d4d"
                          : "white",
                      color:
                        filters.metal === metal ||
                        (metal === "All" && !filters.metal)
                          ? "white"
                          : "#6b7280",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Collections;
