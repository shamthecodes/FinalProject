import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "220px",
                backgroundColor: "#f3f4f6",
              }}
            />
            <div style={{ padding: "16px" }}>
              <div
                style={{
                  height: "10px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  width: "40%",
                }}
              />
              <div
                style={{
                  height: "16px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              />
              <div
                style={{
                  height: "12px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                  width: "50%",
                  marginBottom: "12px",
                }}
              />
              <div
                style={{
                  height: "36px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💍</div>
        <h3
          style={{
            fontSize: "1.4rem",
            color: "#0d4d4d",
            fontFamily: "Cormorant Garamond, serif",
            marginBottom: "8px",
          }}
        >
          No products found
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#6b7280",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
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
  );
};

export default ProductGrid;
