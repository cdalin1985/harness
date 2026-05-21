# HarnessOS

HarnessOS is a premium, enterprise-grade agentic DevOps platform designed to draft, customize, validate, test, and securely export **AI Agent Harnesses** (advanced configuration setups comprising system prompts, workflow guides, memory state strategies, and quality gates). 

HarnessOS bridges the gap between raw LLM completions and reliable, business-aligned agentic operations.

---

## 🚀 Key Features

*   **Integrated Harness Catalog**: Discover and browse battle-tested, role-specific agent scaffolds (e.g., *ZenSupport Pro*, *LeadScout Ultra*).
*   **Version-Controlled Blueprint Editing**: Modify system prompts, customize variables, and track changelogs within an elegant dashboard.
*   **Multi-Layer Security Architecture**: Hardened Firestore security rules, client-side route guards (`ProtectedRoute`/`RoleGuard`), and a server-side AI proxy with rate limiting and input validation.
*   **Dual-Layer Data Engine**: Distinct snake_case database schema maps translated into clean, type-safe camelCase camelCase API objects.
*   **Gemini-Powered Proxy**: Server-side `/api/gemini/generate` route with IP-based rate limiting (10 req/min), max 8,000-character prompt enforcement, and structured JSON error envelopes. API keys are never exposed to the browser.

---

## 🛠️ The Tech Stack

*   **Frontend**: React (v19), Tailwind CSS, Lucide React (Icons), Motion (Animations)
*   **Backend**: Express Server (serving Vite SPA in development, hosting secure API gateways and Gemini proxies)
*   **Database & Auth**: Firebase Auth (Google Login) & Firestore NoSQL Database
*   **Compilation & Quality**: TypeScript (strict mode), Vite, Esbuild (server bundle), ESLint (TypeScript + accessibility + hooks plugins), Vitest (unit test runner)

---

## 📂 Project Architecture

```text
├── docs/
│   ├── ARCHITECTURE.md          # Comprehensive breakdown of our stack and design decisions
│   └── PROJECT_GOVERNANCE.md    # Release cycles, standard operational protocols, and rules
├── src/
│   ├── components/              # Reusable UI elements (Checkout, PremiumLock, etc.)
│   ├── pages/                   # Application views (Catalog, Detail, Landing, Dashboard, Pricing, Waitlist)
│   ├── lib/
│   │   ├── firebase.ts          # Root Firebase initialization, auth state hooks & mapped wrappers
│   │   └── mappers.ts           # Type converters mapping DB models (snake_case) to client DTOs (camelCase)
│   ├── types.ts                 # Full system strict TypeScript boundaries
│   ├── data.ts                  # Mock base catalog templates and stable categories
│   └── main.tsx                 # Client entry point
├── server.ts                    # Full-stack production Express server hosting endpoint boundaries
├── firebase-blueprint.json      # Complete relational-matched datastore blueprint spec
├── firestore.rules              # Audited, hardened secure firestore environment policies
├── package.json                 # Project dependencies & production bundlers
└── tsconfig.json                # Locked-down strict compiler specifications
```

---

## ⚙️ Setup and Installation

### 1. Requirements
Ensure you have **Node.js (v20+)** and **npm** installed.

### 2. Install Dependencies
Run the command below in the project root:
```bash
npm install
```

### 3. Environment Variables Configuration
HarnessOS reads secrets and Firebase keys on both server and client. Copy the example configuration:
```bash
cp .env.example .env
```
Fill in the credentials inside `.env`:
```env
# Server Secret Keys (Isolated from browser)
GEMINI_API_KEY=your_gemini_api_key

# Public & Client Framework variables
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Direct Development Start
Boot the full-stack server using our bundled entry point:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live app.

### 5. Production Compilation and Verification
Compile both client SPA and Express server in a single pipeline:
```bash
# Performs asset compilation and compiles server.ts to dist/server.cjs
npm run build

# Runs production build package
npm run start
```

---

## 🔒 Security & Governance

This repository adheres to standard professional repository governance rules:
*   **Strict Type-Checking**: Relies on strict type configurations to catch undefined indexes, any-usage, and invalid object properties.
*   **Hardened Relational Rules**: All queries on Firestore paths map strictly to authorized security rules. Privilege levels are managed through server-moderated workspace gates.
*   **Zero Client-Side Key Leaks**: All interactions with Gemini go through Express routes with rate limits and parameter schemas.

For more details, consult `/docs/ARCHITECTURE.md` and `/docs/PROJECT_GOVERNANCE.md`.

---

## 📝 License
Licensed under the Apache License, Version 2.0. See LICENSE for details.
