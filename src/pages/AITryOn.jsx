import React, { useState, useRef, useEffect } from "react";
import { Upload, Sparkles, X, ShoppingBag, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
// import { checkAiAllowed } from "@/lib/arcjetClient";

const AITryOn = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [isMobile] = useState(window.innerWidth < 768);

  const [personImage, setPersonImage] = useState(null);
  const [personBase64, setPersonBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const personRef = useRef();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);

  // Fetch all products from Supabase on load
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("Product")
        .select("*")
        .eq("isActive", true);
      setAllProducts(data || []);
    };
    fetchProducts();
  }, []);

  const handlePersonUpload = (file) => {
    const url = URL.createObjectURL(file);
    setPersonImage(url);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPersonBase64(e.target.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
    // Reset previous results
    setSuggestions([]);
    setAiSummary(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    // const { allowed, error } = await checkAiAllowed();
    // if (!allowed) {
    //   setError(`🚫 ${error}`);
    //   return;
    // }
    if (!personBase64) {
      setError("Please upload your photo first!");
      return;
    }
    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions([]);
    setAiSummary(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key missing");

      // Step 1 — Ask AI to analyze person and suggest categories
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a jewellery styling expert for an Indian jewellery store.

Analyze this person's photo carefully and respond ONLY in this exact JSON format, nothing else:

{
  "summary": "2-3 sentence personal styling summary about this person",
  "skinTone": "fair/medium/wheatish/dark",
  "faceShape": "oval/round/square/heart/long",
  "dressColor": "color you can see or 'not visible'",
  "style": "traditional/modern/fusion/casual",
  "topCategories": ["category1", "category2", "category3"],
  "bestMetal": "Gold/Silver/Platinum/Rose Gold",
  "bestStone": "Diamond/Emerald/Pearl/Ruby/Sapphire/None",
  "tip": "one short practical styling tip"
}

Categories must be from: Rings, Earrings, Necklaces, Bracelets, Bangles, Pendants, Bridal Sets

Only respond with the JSON. No extra text.`,
                  },
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: personBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 500,
            },
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "API failed");
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No response from AI");

      // Parse JSON
      // Parse JSON — more robust extraction
      let analysis;
      try {
        // Try to extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found");
        const cleanText = jsonMatch[0];
        analysis = JSON.parse(cleanText);
      } catch (parseErr) {
        console.error("Parse error:", parseErr, "Raw text:", text);
        // Fallback — use default analysis if parse fails
        analysis = {
          summary:
            "You have a beautiful style! Here are our top jewellery picks for you.",
          skinTone: "medium",
          faceShape: "oval",
          dressColor: "not visible",
          style: "traditional",
          topCategories: ["Necklaces", "Earrings", "Bangles"],
          bestMetal: "Gold",
          bestStone: "Diamond",
          tip: "Gold jewellery with diamonds will complement your look beautifully.",
        };
      }

      setAiSummary(analysis);

      // setAiSummary(analysis);

      // Step 2 — Match products from Supabase based on AI analysis
      const matched = [];

      // Filter products by suggested categories + metal + stone
      for (const product of allProducts) {
        let score = 0;

        // Category match
        if (analysis.topCategories?.includes(product.category)) score += 3;

        // Metal match
        if (
          product.metal
            ?.toLowerCase()
            .includes(analysis.bestMetal?.toLowerCase())
        )
          score += 2;

        // Stone match
        if (
          analysis.bestStone &&
          product.stone
            ?.toLowerCase()
            .includes(analysis.bestStone?.toLowerCase())
        )
          score += 2;

        if (score > 0) {
          matched.push({ ...product, matchScore: score });
        }
      }

      // Sort by match score, take top 6
      const top = matched
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6);

      // If less than 3, fill with random products
      if (top.length < 3) {
        const remaining = allProducts
          .filter((p) => !top.find((t) => t.id === p.id))
          .slice(0, 6 - top.length);
        top.push(...remaining);
      }

      setSuggestions(top);

      // Save to Supabase
      if (user) {
        await supabase
          .from("AITryOn")
          .insert({
            userId: user.id,
            result: JSON.stringify(analysis),
            createdAt: new Date().toISOString(),
          })
          .then(({ error }) => {
            if (error) console.log("AITryOn table note:", error.message);
          });
      }
    } catch (err) {
      console.error("AI error:", err);
      if (err.message.includes("JSON")) {
        setError("AI analysis failed — please try again with a clearer photo.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7f0e9" }}>
      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#0d4d4d",
          padding: isMobile ? "40px 24px" : "60px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
        <Sparkles size={32} color="#d4af37" style={{ marginBottom: "12px" }} />
        <h1
          style={{
            fontSize: isMobile ? "2rem" : "3rem",
            fontWeight: "700",
            color: "white",
            margin: "0 0 12px",
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          AI Jewellery Stylist
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.9rem",
            margin: 0,
            maxWidth: "500px",
            marginInline: "auto",
            lineHeight: "1.8",
          }}
        >
          Upload your photo — our AI will suggest the perfect jewellery from our
          collection just for you!
        </p>
      </div>

      <div
        style={{
          padding: isMobile ? "32px 16px" : "48px 80px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* UPLOAD SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "340px 1fr",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* LEFT — Upload */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: "#0d4d4d",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontFamily: "Montserrat, sans-serif",
                  marginBottom: "12px",
                }}
              >
                📸 Upload Your Photo
              </p>

              {/* Person photo upload area */}
              <div
                onClick={() => personRef.current.click()}
                style={{
                  width: "100%",
                  height: isMobile ? "280px" : "380px", // ← fixed height
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: `2px dashed ${personImage ? "#0d4d4d" : "rgba(13,77,77,0.2)"}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden", // ← clips image inside
                  position: "relative",
                }}
              >
                {personImage ? (
                  <>
                    <img
                      src={personImage}
                      alt="You"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // ← fills box nicely
                        objectPosition: "top", // ← shows face first
                        display: "block",
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPersonImage(null);
                        setPersonBase64(null);
                        setSuggestions([]);
                        setAiSummary(null);
                      }}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        zIndex: 10,
                      }}
                    >
                      <X size={16} />
                    </button>

                    {/* Photo label overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.4))",
                        padding: "20px 12px 10px",
                        color: "white",
                        fontSize: "0.7rem",
                        fontFamily: "Montserrat, sans-serif",
                        textAlign: "center",
                        letterSpacing: "1px",
                      }}
                    >
                      Click to change photo
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={36} color="rgba(13,77,77,0.3)" />
                    <p
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.85rem",
                        fontFamily: "Montserrat, sans-serif",
                        margin: "12px 0 4px",
                        textAlign: "center",
                      }}
                    >
                      Click to upload your photo
                    </p>
                    <p
                      style={{
                        color: "#d4af37",
                        fontSize: "0.72rem",
                        fontFamily: "Montserrat, sans-serif",
                        margin: 0,
                      }}
                    >
                      Works for men & women
                    </p>
                  </>
                )}
              </div>
              <input
                ref={personRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) =>
                  e.target.files[0] && handlePersonUpload(e.target.files[0])
                }
              />
            </div>

            {/* ANALYZE BUTTON */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !personImage}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor:
                  loading || !personImage ? "#9ca3af" : "#0d4d4d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: loading || !personImage ? "not-allowed" : "pointer",
                fontFamily: "Montserrat, sans-serif",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Analysing your style...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  FIND MY PERFECT JEWELLERY
                </>
              )}
            </button>

            {/* AI Summary Card */}
            {aiSummary && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <Sparkles size={16} color="#d4af37" />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      color: "#0d4d4d",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Your Style Profile
                  </p>
                </div>

                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#374151",
                    lineHeight: "1.7",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "300",
                    margin: "0 0 16px",
                  }}
                >
                  {aiSummary.summary}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {[
                    { label: "Best Metal", value: aiSummary.bestMetal },
                    { label: "Best Stone", value: aiSummary.bestStone },
                    { label: "Face Shape", value: aiSummary.faceShape },
                    { label: "Style", value: aiSummary.style },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        backgroundColor: "#f7f0e9",
                        borderRadius: "6px",
                        padding: "8px 10px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.58rem",
                          color: "#9ca3af",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          color: "#0d4d4d",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(212,175,55,0.1)",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    borderLeft: "3px solid #d4af37",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      color: "#0d4d4d",
                      fontFamily: "Montserrat, sans-serif",
                      fontStyle: "italic",
                    }}
                  >
                    💡 {aiSummary.tip}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Suggested Products */}
          <div>
            {!aiSummary && !loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "320px",
                  textAlign: "center",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "2px dashed rgba(13,77,77,0.1)",
                }}
              >
                <Sparkles size={40} color="rgba(13,77,77,0.15)" />
                <p
                  style={{
                    color: "#9ca3af",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.85rem",
                    marginTop: "16px",
                  }}
                >
                  Upload your photo and click
                  <br />
                  <strong style={{ color: "#0d4d4d" }}>
                    "Find My Perfect Jewellery"
                  </strong>
                  <br />
                  to see AI-matched suggestions from our collection
                </p>
              </div>
            )}

            {loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "320px",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid rgba(13,77,77,0.1)",
                    borderTop: "4px solid #d4af37",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p
                  style={{
                    color: "#0d4d4d",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.85rem",
                  }}
                >
                  Finding your perfect jewellery...
                </p>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  color: "#dc2626",
                  fontSize: "0.85rem",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                ❌ {error}
              </div>
            )}

            {/* SUGGESTED PRODUCTS */}
            {suggestions.length > 0 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: "#0d4d4d",
                      margin: 0,
                    }}
                  >
                    Perfect for You ✨
                  </h2>
                  <button
                    onClick={() => navigate("/collections")}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgba(13,77,77,0.2)",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "0.72rem",
                      fontWeight: "600",
                      color: "#0d4d4d",
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    See All →
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr 1fr"
                      : "repeat(3, 1fr)",
                    gap: "16px",
                  }}
                >
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        transition: "transform 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-3px)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {/* Match badge */}
                      {product.matchScore >= 3 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            backgroundColor: "#d4af37",
                            color: "#0d4d4d",
                            fontSize: "0.55rem",
                            fontWeight: "700",
                            padding: "3px 7px",
                            borderRadius: "3px",
                            zIndex: 2,
                            letterSpacing: "0.5px",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                        >
                          ✦ BEST MATCH
                        </div>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product, isSignedIn, navigate);
                        }}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          zIndex: 2,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Heart
                          size={13}
                          fill={isWishlisted(product.id) ? "#d4af37" : "none"}
                          color={
                            isWishlisted(product.id) ? "#d4af37" : "#9ca3af"
                          }
                        />
                      </button>

                      {/* Image */}
                      <div
                        style={{
                          height: "160px",
                          backgroundColor: "#f7f0e9",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) =>
                            (e.target.src =
                              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300")
                          }
                        />
                      </div>

                      {/* Details */}
                      <div style={{ padding: "12px" }}>
                        <span
                          style={{
                            fontSize: "0.55rem",
                            color: "#d4af37",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            fontWeight: "600",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                        >
                          {product.category}
                        </span>
                        <p
                          style={{
                            margin: "3px 0 6px",
                            fontSize: "0.82rem",
                            fontWeight: "600",
                            color: "#0d4d4d",
                            fontFamily: "Cormorant Garamond, serif",
                            lineHeight: "1.3",
                          }}
                        >
                          {product.name}
                        </p>
                        <p
                          style={{
                            margin: "0 0 10px",
                            fontSize: "0.88rem",
                            fontWeight: "700",
                            color: "#0d4d4d",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                        >
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addItem(product, isSignedIn, navigate);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#0d4d4d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.65rem",
                            fontWeight: "700",
                            letterSpacing: "1px",
                            cursor: "pointer",
                            fontFamily: "Montserrat, sans-serif",
                            textTransform: "uppercase",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <ShoppingBag size={11} />
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AITryOn;
