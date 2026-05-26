import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Search, Heart, ShoppingBag, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "../store/cartStore";
// import { useWishlistStore } from "../store/wishlistStore";
import React from "react";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const cartCount = useCartStore((s) => s.getCount());
  // const wishlistCount = useWishlistStore((s) => s.getCount());

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/collections" },
    { label: "Rings", path: "/collections/Rings" },
    { label: "Earrings", path: "/collections/Earrings" },
    { label: "Necklaces", path: "/collections/Necklaces" },
    { label: "Bridal", path: "/collections/Bridal Sets" },
    { label: "About Us", path: "/about" },
  ];

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div className="announcement-bar">
        <span className="announcement-left">
          🚚 Free Shipping on Orders Above ₹1999
        </span>
        <span className="announcement-bar-center">
          Timeless Elegance, Crafted for You
        </span>
        <div className="announcement-bar-right">
          <span>Track Order</span>
          <span>|</span>
          <span>Help</span>
          <span>|</span>
          <span>Stores</span>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="header">
        {/* LEFT — Logo */}
        <Link to="/" className="header-logo" style={{ textDecoration: "none" }}>
          <span className="header-logo-name">JewelsNow</span>
          <span className="header-logo-sub">JEWELS IN TRICE</span>
        </Link>

        {/* CENTER — Desktop Nav */}
        <nav className="header-nav">
          {navLinks.map((item) => (
            <Link key={item.label} to={item.path} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT — Icons */}
        <div className="header-icons">
          <Search size={20} className="header-icon" />

          {/* NOT logged in */}
          <SignedOut>
            <SignInButton mode="redirect">
              <button className="btn-signin">Sign In</button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="btn-signup">Sign Up</button>
            </SignUpButton>
          </SignedOut>

          {/* Logged in */}
          <SignedIn>
            <Heart
              size={20}
              className="header-icon"
              onClick={() => navigate("/wishlist")}
            />
            <div
              className="cart-icon-wrapper"
              onClick={() => navigate("/cart")}
              style={{ cursor: "pointer" }}
            >
              <ShoppingBag size={20} className="header-icon" />
              <span className="cart-badge">{cartCount}</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Mobile menu */}
          <div className="mobile-menu">
            <Sheet>
              <SheetTrigger asChild>
                <Menu size={22} style={{ cursor: "pointer" }} />
              </SheetTrigger>
              <SheetContent side="right" style={{ backgroundColor: "#fff" }}>
                <div style={{ marginBottom: "32px" }}>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      color: "#0d4d4d",
                      fontFamily: "Tangerine, cursive",
                    }}
                  >
                    JewelsNow
                  </div>
                  <div
                    style={{
                      fontSize: "0.55rem",
                      letterSpacing: "3px",
                      color: "#d4af37",
                    }}
                  >
                    JEWELS IN TRICE
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {navLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      style={{
                        fontSize: "0.85rem",
                        color: "#0d4d4d",
                        textDecoration: "none",
                        fontWeight: "500",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        borderBottom: "1px solid rgba(13,77,77,0.08)",
                        paddingBottom: "16px",
                        paddingTop: "12px",
                        display: "block",
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <SignedOut>
                    <SignInButton mode="redirect">
                      <button
                        style={{
                          width: "100%",
                          padding: "12px",
                          backgroundColor: "transparent",
                          border: "1px solid #0d4d4d",
                          color: "#0d4d4d",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          letterSpacing: "1px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        SIGN IN
                      </button>
                    </SignInButton>
                    <SignUpButton mode="redirect">
                      <button
                        style={{
                          width: "100%",
                          padding: "12px",
                          backgroundColor: "#0d4d4d",
                          border: "none",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          letterSpacing: "1px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        SIGN UP
                      </button>
                    </SignUpButton>
                  </SignedOut>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
