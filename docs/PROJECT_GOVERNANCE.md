# Project Governance & Operational Code

This document outlines the engineering protocols, release strategies, quality gates, and database schema change management procedures for **HarnessOS**. All developers contributing to this repository must adhere strictly to these principles.

---

## 📅 1. Core Engineering Protocols

### Strict Type Enforcement
- **No Implicit `any`**: Explicit typings must be declared for all data structures, functions, and state bounds. Let compiler checks fail builds if implicit anies slide in.
- **Null Safety**: Always leverage optional chaining (`?.`) or exhaustive status checks for fields stored in Firestore, which represents an asynchronous, schema-on-read context.
- **Relational Integrity**: Use relational maps when linking models; never hardcode slugs or nested names where stable keys (IDs) exist.

### Code Style & Structure
- Components must remain container-bound and modular. Do not load thousands of lines of UI markup and backend fetching queries into singular files.
- Organize types inside `/src/types.ts` and data encoders inside `/src/lib/mappers.ts`.

---

## ⛓️ 2. Pull Requests & Validation Rules

To merge any update into the main branch, the following steps must be verified locally or in CI:

1.  **Strict Lint Verification**:
    ```bash
    npm run lint
    ```
    Must return zero errors.
2.  **Compilation Compliance**:
    ```bash
    npm run build
    ```
    Must bundle successfully without warnings or Type discrepancies.
3.  **Local Rule Auditing**:
    Verify that security alterations in `/firestore.rules` align exactly with the database invariants specified in `security_spec.md`. Any new collection path must be explicitly mapped inside `firebase-blueprint.json` first.

---

## 🗄️ 3. Database Schema Change Management (Firestore)

As HarnessOS uses a NoSQL schema (Firestore), care must be taken to prevent data drift between old and new documents.

### The Conversion Engine Rule
- All direct reads and writes on Firestore documents must go through the converter hooks defined in `/src/lib/mappers.ts`.
- If an attribute in a Firestore document is renamed, a corresponding translation must be placed in `/src/lib/mappers.ts` to ensure backward-compatibility for active users.

### Security-First Alterations
No new Firebase write or document format can be committed without:
1.  Documenting the schema requirements in `firebase-blueprint.json`
2.  Updating security guidelines in `firestore.rules`
3.  Deploying rules via the Firebase CLI to active projects block-by-block. 

---

## 🚀 4. Lifecycle & Branch Model

-   **`main`**: Reflects the stable, deployable code serving [HarnessOS Live](https://harnessos.com). Protected branch. Direct pushes are barred except for authenticated automated builds.
-   **`dev`**: The ongoing integrations branch where team validations run.
-   **Features branches (`feat/*` or `fix/*`)**: Developers branch from `dev` and submit PRs with detailed changelogs focusing exclusively on the literal parameters of requested tasks. No feature accretion allowed.
