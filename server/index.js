import express from "express";
import cors from "cors";
import arcjet, { shield, rateLimit, detectBot } from "@arcjet/node";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ── ARCJET INSTANCE ─────────────────────────────
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Block common attacks (SQLi, XSS etc)
    shield({ mode: "LIVE" }),

    // Rate limit — 100 requests per minute per IP
    rateLimit({
      mode: "LIVE",
      window: "1m",
      max: 100,
    }),

    // Block bots (scrapers, crawlers)
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"], // allow Google/Bing
    }),
  ],
});

// ── MIDDLEWARE — apply Arcjet to all routes ──────
app.use(async (req, res, next) => {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return res.status(429).json({
        error: "Too many requests. Please slow down.",
        retryAfter: decision.reason.resetTime,
      });
    }
    if (decision.reason.isBot()) {
      return res.status(403).json({ error: "Bot detected. Access denied." });
    }
    if (decision.reason.isShield()) {
      return res
        .status(403)
        .json({ error: "Attack detected. Request blocked." });
    }
    return res.status(403).json({ error: "Request denied." });
  }

  next();
});

// ── ARCJET with stricter rules for payment ───────
const paymentAj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    rateLimit({
      mode: "LIVE",
      window: "1m",
      max: 5, // only 5 payment attempts per minute
    }),
    detectBot({ mode: "LIVE", allow: [] }),
  ],
});

// ── ARCJET with stricter rules for login ─────────
const loginAj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    rateLimit({
      mode: "LIVE",
      window: "15m",
      max: 10, // only 10 login attempts per 15 minutes
    }),
    detectBot({ mode: "LIVE", allow: [] }),
  ],
});

// ── ROUTES ───────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "JewelsNow API running" });
});

// Payment protection — stricter
app.post("/api/payment/verify", async (req, res) => {
  const decision = await paymentAj.protect(req);

  if (decision.isDenied()) {
    return res.status(429).json({
      error: "Too many payment attempts. Please wait before trying again.",
    });
  }

  // Payment is allowed — return success
  res.json({
    allowed: true,
    message: "Payment request verified",
  });
});

// Login protection — brute force protection
app.post("/api/auth/check", async (req, res) => {
  const decision = await loginAj.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return res.status(429).json({
        error: "Too many login attempts. Please wait 15 minutes.",
      });
    }
    return res.status(403).json({ error: "Access denied." });
  }

  res.json({ allowed: true });
});

// AI Try-On protection — prevent API abuse
const aiAj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    rateLimit({
      mode: "LIVE",
      window: "1h",
      max: 10, // only 10 AI requests per hour per IP
    }),
  ],
});

app.post("/api/ai/check", async (req, res) => {
  const decision = await aiAj.protect(req);

  if (decision.isDenied()) {
    return res.status(429).json({
      error: "AI try-on limit reached. Please try again in an hour.",
    });
  }

  res.json({ allowed: true });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ JewelsNow API + Arcjet running on http://localhost:${PORT}`);
});
