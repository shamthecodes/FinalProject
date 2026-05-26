
// ✅ Correct
import { SignIn } from "@clerk/clerk-react"


const Login = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#0d4d4d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        
      }}
    >
      {/* Gold circle top left */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          border: "70px solid rgba(212,175,55,0.08)",
          top: "-150px",
          left: "-150px",
        }}
      />

      {/* Gold circle bottom right */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          border: "60px solid rgba(212,175,55,0.06)",
          bottom: "-120px",
          right: "-120px",
        }}
      />

      {/* Center card */}
      <div
        style={{
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Logo above card */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", color: "#d4af37" }}>✦</div>
          <h1
            style={{
              fontSize: "5rem",
              fontWeight: "700",
              letterSpacing: "2px",
              color: "white",
              fontFamily: "'Tangerine', cursive",
            }}
          >
            JewelsNow
          </h1>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "3px",
              color: "#d4af37",
              margin: "0",
            }}
          >
            JEWELS IN TRICE
          </p>
        
        </div>

        {/* Clerk form card */}
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          afterSignInUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#0d4d4d",
              colorBackground: "#ffffff",
              colorText: "#0d4d4d",
              colorInputBackground: "#f7f0e9",
              borderRadius: "12px",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;
