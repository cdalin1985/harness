import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// ---------------------------------------------------------------------------
// Rate Limiter (in-memory, per-IP)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;        // max requests per window
const RATE_WINDOW_MS = 60_000; // 1-minute window
const MAX_PROMPT_LENGTH = 8_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ---------------------------------------------------------------------------
// Standard error envelope
// ---------------------------------------------------------------------------
function apiError(
  res: express.Response,
  status: number,
  code: string,
  message: string
): void {
  res.status(status).json({ success: false, error: { code, message } });
}

// ---------------------------------------------------------------------------
// Server bootstrap
// ---------------------------------------------------------------------------
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
  });

  // ---------------------------------------------------------------------------
  // Gemini Proxy — hardened
  // TODO: Add Firebase ID token verification via Admin SDK for production
  // ---------------------------------------------------------------------------
  app.post("/api/gemini/generate", async (req, res) => {
    // 1. Rate limit
    const ip = req.ip ?? "unknown";
    if (!checkRateLimit(ip)) {
      apiError(res, 429, "RATE_LIMIT_EXCEEDED", "Too many requests. Please wait before trying again.");
      return;
    }

    // 2. Input validation
    const { prompt } = req.body as { prompt?: unknown };
    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      apiError(res, 400, "INVALID_REQUEST", "prompt must be a non-empty string.");
      return;
    }

    // 3. Length cap
    if (prompt.length > MAX_PROMPT_LENGTH) {
      apiError(
        res,
        400,
        "PROMPT_TOO_LONG",
        `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters.`
      );
      return;
    }

    // 4. API key presence
    if (!process.env.GEMINI_API_KEY) {
      apiError(res, 500, "CONFIGURATION_ERROR", "AI service is not configured.");
      return;
    }

    // 5. Upstream call
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { "User-Agent": "harnessos/1.0" } },
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ parts: [{ text: prompt }] }],
      });

      res.json({ success: true, text: response.text });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown upstream error";
      console.error("[HarnessOS] Gemini upstream error:", message);
      apiError(res, 502, "UPSTREAM_ERROR", "AI service request failed. Please try again.");
    }
  });

  // ---------------------------------------------------------------------------
  // SPA serving
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HarnessOS Server running on http://localhost:${PORT}`);
  });
}

startServer();
