# Systems Architecture Specification

This document provides a technical walkthrough of the **HarnessOS** architecture strategy. It acts as the source of truth for engineering decisions, subsystem relationships, data flow paradigms, and security guarantees.

---

## 🎨 1. Full-Stack Express + Vite Architecture

HarnessOS uses a single-process Express + Vite architecture optimized for MVP development speed. Production-scale deployments may benefit from separating the API server, static frontend hosting, and background job workers into distinct services.

```text
[ Browser SPA ]
      │
      │ HTTP Request API Gateway
      ▼
┌─────────────────────────────── Express Server (Port 3000) ────────────────────────┐
│                                                                                   │
│  [ Secure API Router ] ──────► Validate Session ──► Exec Proxy (e.g., Gemini AI)  │
│          │                                                                        │
│          ▼ (If Static Asset / Route Fallback)                                     │
│  [ Vite Middleware (Dev) ] OR [ Static File Server (Prod /dist) ]                 │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

### Key Subsystems:
1.  **Vite Asset Servicing**: Handles hot reloading and SPA routing during development via Vite's `createViteServer` integration. In production, compiled static assets are served from the `/dist` directory.
2.  **Express API Routers**: Located at `/api/*`. Handlers perform strict payload parsing, workspace identification, and proxy third-party APIs (such as Gemini, authentication state syncs, and mock checkout gates).
3.  **The Entrypoint Boundary (`server.ts`)**: Boots on Port `3000` bound to host `0.0.0.0`, facilitating standard container orchestration on Cloud Run or similar platforms.

---

## 📡 2. Dual-Layer Data Modeling & Relational Mapping

To maintain high data integrity on Firestore collections while preserving an ergonomic frontend, HarnessOS enforces a strict boundary between database structures (snake_case) and API DTO models (camelCase).

### The Translation Layer (`src/lib/mappers.ts`):
All reads and writes on Firestore documents are routed through conversion pipelines. This prevents naming mismatch errors, prevents drift, and ensures strict type-safety across the ecosystem.

*   **Database Types**:
    *   `db_user`: `{ uid, email, display_name, photo_url, role, created_at }`
    *   `db_workspace`: `{ id, owner_id, name, plan, created_at, updated_at }`
    *   `db_harness_instance`: `{ id, workspace_id, template_id, version_id, customized_variables, customized_prompt, notes, status, created_at }`
*   **Frontend Types**:
    *   Mapped into camelCase definitions: `User`, `Workspace`, `HarnessInstance`, etc., in complete alignment with `/src/types.ts`.

---

## 🔒 3. Multi-Layer Security Architecture

The platform locks access down using a three-tier shield format:

### Tier 1: Client Protected Routes & Guards
*   **`ProtectedRoute`** (`src/components/auth/ProtectedRoute.tsx`): Evaluates active auth session; redirects unauthenticated users to the landing page. Applied to `/dashboard`, `/settings`, and `/builder`.
*   **`RoleGuard`** (`src/components/auth/RoleGuard.tsx`): Checks `user.role` against an `allowedRoles` list; renders an "Access Denied" screen for unauthorized roles. Applied to `/admin` and `/admin/editor` (requires `admin`, `super_admin`, or `content_editor`).
*   **`PremiumLock`**: Restricts sensitive blueprint content on detail pages, displaying the purchase modal if the user has not unlocked the harness.

### Tier 2: Hardened Firestore Security Rules
All read and write queries sent directly from the client to Firestore are parsed against a robust, declarative security suite (`firestore.rules`):
*   **Relational Verification**: Users can only read instances associated with their active workspace id.
*   **Immutable Metadata**: System fields (such as role states or timestamps) are blocked from client updates.
*   **Identity Pinning**: Disallows account spoofing by verifying `request.auth.uid == userId`.

### Tier 3: Isolated AI Proxy (No Client-Side Keys)
Following security mandates, **no Gemini API key is ever shared or exposed to the client browser**. All generative tasks are routed through the `/api/gemini/generate` Express endpoint, which enforces:
- **IP-based rate limiting**: 10 requests per minute per client IP (in-memory, suitable for MVP scale)
- **Input validation**: `prompt` must be a non-empty string
- **Prompt length cap**: Maximum 8,000 characters per request
- **Structured error envelopes**: `{ success: false, error: { code, message } }` — no raw provider errors reach the client
- **Model lock**: Requests are fixed to `gemini-2.0-flash`

> **Note:** Server-side Firebase ID token verification (via Admin SDK) is not yet implemented. This is the recommended next step before production deployment.

---

## 🚀 4. Compilation & Deployment Pipelines

*   **Compiler Directives**: Strict rules in `tsconfig.json` guarantee that accidental type bypasses (`any`, index drifts, missing JS parameters) throw errors at build time.
*   **Standalone Server Bundler**: We compile `server.ts` into a dedicated CommonJS file at `dist/server.cjs` via `esbuild`. This enables lightweight runtime execution with minimal cold start latency.

---

## 5. Current Limitations (MVP Phase)

This section documents known gaps between the current implementation and a production-ready deployment. Honest engineering docs build trust.

- **No server-side auth on AI proxy**: The `/api/gemini/generate` endpoint does not yet verify Firebase ID tokens. A Firebase Admin SDK integration is needed before this endpoint is exposed publicly.
- **Workspace membership is owner-only**: The Firestore rules and data model treat the workspace owner as the sole member. A `members` subcollection is planned for team collaboration.
- **Test coverage is engine-only**: The Vitest suite (`src/lib/__tests__/harness-engine.test.ts`) covers the core `HarnessEngine` logic. Component-level (React Testing Library) and end-to-end (Playwright) tests are not yet implemented.
- **In-process rate limiting**: The current IP rate limiter uses a `Map` in Node.js memory. It resets on server restart and does not coordinate across multiple instances. Redis-backed rate limiting is recommended for production scale.
- **Mock data only**: The catalog, dashboard instances, and builder state are currently driven by static mock data in `src/data.ts`. Full Firestore integration for live data reads/writes is the next major milestone.
