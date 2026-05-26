const AuthLayout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* LEFT — Brand Side */}
      <div
        style={{
          width: "45%",
          backgroundColor: "#0d4d4d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          textAlign: "center",
          padding: "40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold circle top */}
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "60px solid rgba(212,175,55,0.1)",
            top: "-100px",
            left: "-100px",
          }}
        />

        {/* Gold circle bottom */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            border: "40px solid rgba(212,175,55,0.08)",
            bottom: "-80px",
            right: "-80px",
          }}
        />

        {/* Brand Content */}
        <div style={{ zIndex: 1 }}>
          <div style={{ fontSize: "3rem", color: "#d4af37" }}>✦</div>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              letterSpacing: "8px",
              color: "white",
              margin: "8px 0 0",
            }}
          >
            LUXORA
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              letterSpacing: "6px",
              color: "#d4af37",
              margin: "4px 0 32px",
            }}
          >
            JEWELS
          </p>
          <div
            style={{
              borderTop: "1px solid rgba(212,175,55,0.3)",
              paddingTop: "24px",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.7)",
              lineHeight: "2",
            }}
          >
            {/* This changes per page */}
            {children.props.tagline || "Timeless Elegance, Crafted for You"}
          </div>
        </div>
      </div>

      {/* RIGHT — Form Side */}
      <div
        style={{
          width: "55%",
          backgroundColor: "#f7f0e9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
