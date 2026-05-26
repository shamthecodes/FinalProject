// src/pages/ProductListing.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts, useCategories } from "../hooks/useProducts";
import ProductCard from "../components/products/ProductCard";
// import { SlidersHorizontal, X } from "lucide-react";

const ProductListing = () => {
  const { category: categoryParam } = useParams();
  const [search, setSearch] = useState("");
  const [metal, setMetal] = useState("");
  const [stone, setStone] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  //   const [showFilters, setShowFilters] = useState(false);

  const { categories } = useCategories();

  const { products, pagination, loading, error } = useProducts({
    category: categoryParam || undefined,
    metal: metal || undefined,
    stone: stone || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    search: search || undefined,
    page,
    limit: 12,
  });

  const resetFilters = () => {
    setMetal("");
    setStone("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = metal || stone || minPrice || maxPrice || search;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f0e9" }}>
      {/* ── PAGE HEADER ─────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#0d4d4d",
          padding: "40px 80px 32px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <p
            style={{
              color: "#d4af37",
              fontSize: "0.65rem",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            Our Collection
          </p>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "2.8rem",
              color: "white",
              margin: 0,
              fontWeight: "700",
            }}
          >
            {categoryParam || "All Jewellery"}
          </h1>
          {pagination && (
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.8rem",
                margin: "8px 0 0",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {pagination.total} pieces
            </p>
          )}
        </div>

        {/* Search bar */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search jewellery…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "10px 16px",
              borderRadius: "4px",
              border: "1px solid rgba(212,175,55,0.3)",
              backgroundColor: "rgba(255,255,255,0.06)",
              color: "white",
              fontSize: "0.82rem",
              fontFamily: "Montserrat, sans-serif",
              outline: "none",
              width: "240px",
            }}
          />
        </div>
      </div>

      <div style={{ padding: "32px 80px", display: "flex", gap: "32px" }}>
        {/* ── SIDEBAR FILTERS ─────────────────────────────────── */}
        <aside style={{ width: "220px", flexShrink: 0 }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              position: "sticky",
              top: "90px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.2rem",
                  color: "#0d4d4d",
                  margin: 0,
                }}
              >
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#d4af37",
                    fontSize: "0.72rem",
                    fontWeight: "600",
                    letterSpacing: "1px",
                  }}
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* Category */}
            {!categoryParam && (
              <FilterGroup label="Category">
                {categories.map((cat) => (
                  <a
                    key={cat}
                    href={`/collections/${cat}`}
                    style={{
                      display: "block",
                      padding: "4px 0",
                      fontSize: "0.82rem",
                      color: "#374151",
                      textDecoration: "none",
                    }}
                  >
                    {cat}
                  </a>
                ))}
              </FilterGroup>
            )}

            {/* Metal */}
            <FilterGroup label="Metal">
              {["Gold", "White Gold", "Platinum", "Silver"].map((m) => (
                <label
                  key={m}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    marginBottom: "6px",
                  }}
                >
                  <input
                    type="radio"
                    name="metal"
                    checked={metal === m}
                    onChange={() => {
                      setMetal(metal === m ? "" : m);
                      setPage(1);
                    }}
                    style={{ accentColor: "#0d4d4d" }}
                  />
                  <span style={{ fontSize: "0.82rem", color: "#374151" }}>
                    {m}
                  </span>
                </label>
              ))}
            </FilterGroup>

            {/* Stone */}
            <FilterGroup label="Stone">
              {["Diamond", "Emerald", "Sapphire", "Pearl", "Polki", "Ruby"].map(
                (s) => (
                  <label
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      marginBottom: "6px",
                    }}
                  >
                    <input
                      type="radio"
                      name="stone"
                      checked={stone === s}
                      onChange={() => {
                        setStone(stone === s ? "" : s);
                        setPage(1);
                      }}
                      style={{ accentColor: "#0d4d4d" }}
                    />
                    <span style={{ fontSize: "0.82rem", color: "#374151" }}>
                      {s}
                    </span>
                  </label>
                ),
              )}
            </FilterGroup>

            {/* Price range */}
            <FilterGroup label="Price Range (₹)">
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: "80px",
                    padding: "6px 8px",
                    borderRadius: "4px",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.78rem",
                  }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: "80px",
                    padding: "6px 8px",
                    borderRadius: "4px",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.78rem",
                  }}
                />
              </div>
            </FilterGroup>
          </div>
        </aside>

        {/* ── PRODUCT GRID ─────────────────────────────────────── */}
        <main style={{ flex: 1 }}>
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "24px",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "360px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0,0,0,0.06)",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
            </div>
          )}

          {error && (
            <div
              style={{ textAlign: "center", padding: "60px", color: "#ef4444" }}
            >
              <p style={{ fontFamily: "Montserrat, sans-serif" }}>
                Failed to load products: {error}
              </p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.8rem",
                  color: "#0d4d4d",
                }}
              >
                No products found
              </p>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "0.85rem",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Try adjusting your filters
              </p>
              <button
                onClick={resetFilters}
                style={{
                  marginTop: "16px",
                  padding: "10px 24px",
                  backgroundColor: "#0d4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                  fontWeight: "700",
                }}
              >
                CLEAR FILTERS
              </button>
            </div>
          )}

          {!loading && products.length > 0 && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "24px",
                }}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "48px",
                  }}
                >
                  {Array.from({ length: pagination.totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "4px",
                        border:
                          page === i + 1
                            ? "none"
                            : "1px solid rgba(13,77,77,0.2)",
                        backgroundColor: page === i + 1 ? "#0d4d4d" : "white",
                        color: page === i + 1 ? "white" : "#0d4d4d",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Small helper component
const FilterGroup = ({ label, children }) => (
  <div style={{ marginBottom: "24px" }}>
    <p
      style={{
        fontSize: "0.6rem",
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "#d4af37",
        fontWeight: "700",
        margin: "0 0 12px",
      }}
    >
      {label}
    </p>
    {children}
  </div>
);

export default ProductListing;
