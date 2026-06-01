import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { supabase } from "../lib/supabase";
import React, { useState, useRef, useEffect } from "react";
import "./Header.css";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const cartCount = useCartStore((s) => s.getCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/collections" },
    { label: "Rings", path: "/collections/Rings" },
    { label: "Earrings", path: "/collections/Earrings" },
    { label: "Necklaces", path: "/collections/Necklaces" },
    { label: "Bridal", path: "/collections/Bridal Sets" },
    { label: "About Us", path: "/about" },
  ];

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Search when 4+ chars typed
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 4) {
        setSearchResults([]);
        return;
      }
      const { data } = await supabase
        .from("Product")
        .select("id, name, category, price, images")
        .ilike("name", `%${searchQuery}%`)
        .limit(5);
      setSearchResults(data || []);
    };
    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div className="announcement-bar">
        <span>🚚 Free Shipping on Orders Above ₹1999</span>
        <span className="announcement-bar-center">
          Timeless Elegance, Crafted for You
        </span>
        <div className="announcement-bar-right">
          <span
            onClick={() => navigate("/track-order")}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Track Order
          </span>
          <span>|</span>
          <span
            onClick={() => navigate("/about")}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Help
          </span>
          <span>|</span>
          <span
            onClick={() => navigate("/collections")}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Stores
          </span>
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
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT — Icons */}
        <div className="header-icons">
          {/* SEARCH with dropdown */}
          <div ref={searchRef} style={{ position: "relative" }}>
            <Search
              size={20}
              className="header-icon"
              onClick={() => setSearchOpen(!searchOpen)}
              style={{ cursor: "pointer" }}
            />

            {searchOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "32px",
                  right: 0,
                  width: "320px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  zIndex: 200,
                  overflow: "hidden",
                  border: "1px solid rgba(13,77,77,0.08)",
                }}
              >
                {/* Input */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(13,77,77,0.08)",
                  }}
                >
                  <Search size={16} color="#9ca3af" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search jewellery..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "0.85rem",
                      color: "#0d4d4d",
                      width: "100%",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  />
                  {searchQuery && (
                    <X
                      size={14}
                      style={{ cursor: "pointer", color: "#9ca3af" }}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    />
                  )}
                </div>

                {/* Hint — type more */}
                {searchQuery.length > 0 && searchQuery.length < 4 && (
                  <div
                    style={{
                      padding: "16px",
                      color: "#9ca3af",
                      fontSize: "0.75rem",
                      fontFamily: "Montserrat, sans-serif",
                      textAlign: "center",
                    }}
                  >
                    Type {4 - searchQuery.length} more character
                    {4 - searchQuery.length > 1 ? "s" : ""} to search...
                  </div>
                )}

                {/* Results */}
                {searchQuery.length >= 4 && searchResults.length > 0 && (
                  <div>
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          navigate(`/product/${item.id}`);
                          setSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 16px",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f7f0e9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          style={{
                            width: "44px",
                            height: "44px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            backgroundColor: "#f7f0e9",
                            flexShrink: 0,
                          }}
                          onError={(e) =>
                            (e.target.src =
                              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100")
                          }
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.82rem",
                              fontWeight: "600",
                              color: "#0d4d4d",
                              fontFamily: "Montserrat, sans-serif",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.7rem",
                              color: "#d4af37",
                              fontFamily: "Montserrat, sans-serif",
                            }}
                          >
                            {item.category} • ₹
                            {item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* See all */}
                    <div
                      onClick={() => {
                        navigate(`/collections`);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      style={{
                        padding: "12px 16px",
                        borderTop: "1px solid rgba(13,77,77,0.08)",
                        fontSize: "0.75rem",
                        color: "#0d4d4d",
                        fontWeight: "600",
                        cursor: "pointer",
                        textAlign: "center",
                        fontFamily: "Montserrat, sans-serif",
                        backgroundColor: "#f7f0e9",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0e8e0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f7f0e9")
                      }
                    >
                      See all results for "{searchQuery}" →
                    </div>
                  </div>
                )}

                {/* No results */}
                {searchQuery.length >= 4 && searchResults.length === 0 && (
                  <div
                    style={{
                      padding: "24px 16px",
                      textAlign: "center",
                      color: "#6b7280",
                      fontSize: "0.82rem",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    No results for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

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
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => navigate("/wishlist")}
            >
              <Heart size={20} className="header-icon" />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    backgroundColor: "#d4af37",
                    color: "#0d4d4d",
                    fontSize: "0.55rem",
                    fontWeight: "700",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </div>

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
