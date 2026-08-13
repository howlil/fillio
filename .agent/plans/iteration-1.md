# Iteration 1 — Extension Skeleton + Profile Vertical Slice

Status: **completed**.

This file is the execution record for Iteration 1. Current project state lives in `.agent/iteration-state.md`.

## Goal

Establish a loadable WXT/React Chromium extension with a versioned canonical career profile, local persistence, base-profile + application-variant resolution, a minimal profile editor, and a toolbar popup/readiness view before building the form-analysis/autofill engine.

## Architecture delivered

The implementation keeps responsibilities separated by volatility:

```text
entrypoints / UI
      ↓
application contracts + use-case logic
      ↓
domain model + pure behavior

infrastructure adapters
      ↓
application/domain contracts
```

The persisted v1 envelope stores only normal career-profile data. Sensitive-profile domain structures are defined separately for the future encrypted vault and are not part of normal local persistence.

## Stack

- WXT
- Manifest V3
- TypeScript strict mode
- React
- Zod runtime validation
- Vitest + WXT testing integration
- React Testing Library
- Playwright Chromium smoke verification
- ESLint flat config
- Prettier
- npm lockfile

## Completed tasks

### 1. Project bootstrap and quality gates

Completed:

- WXT/React/TypeScript project bootstrap
- Manifest V3 configuration
- extension permission restricted to `storage`
- strict TypeScript configuration
- Vitest + jsdom + React cleanup setup
- ESLint and Prettier
- reproducible `package-lock.json`
- GitHub Actions CI
- build and zip/package commands

### 2. Canonical profile v1 schema and migration boundary

Completed RED → GREEN → REFACTOR cycle for:

- valid v1 profile parsing
- repeated career entities represented as arrays
- malformed persisted payload rejection
- explicit unsupported future-version failure
- `StoredProfileEnvelopeSchema` / `StoredProfileEnvelope`
- separate `SensitiveProfileSchema` / `SensitiveProfile`
- `createEmptyStoredProfile()`
- `parseStoredProfile()`
- v1 migration/version dispatch boundary without invented legacy migrations

Sensitive values are deliberately absent from the normal persisted envelope.

### 3. Variant resolution and local profile repository

Completed RED → GREEN → REFACTOR cycle for:

- pure base-profile cloning and supported application-variant overrides
- preservation of factual base-profile data
- explicit deferral of variant fields whose resolution semantics are not part of Iteration 1
- `ProfileRepository` application port
- `ChromeProfileRepository` using `browser.storage.local`
- empty-storage behavior
- save/load round trip
- runtime validation of persisted data

No Chrome/WXT API leaks into domain logic.

### 4. Profile editor vertical slice

Completed RED → GREEN cycle for the options/profile experience:

- load empty or persisted profile
- edit core identity/contact/link data
- create career records for experience, education, and skills
- edit/remove records through the profile UI
- create lightweight application variants
- choose and maintain a default variant
- persist schema-valid profile data through the repository boundary
- rehydrate persisted state

The UI uses local React state and small explicit functions. No form framework or global state-management dependency was added.

### 5. Popup readiness and browser verification

Completed RED → GREEN cycle for:

- deterministic readiness across identity, contact, links, experience, education, and skills
- toolbar popup empty/ready states
- application-variant count and names
- opening profile settings from the popup

Final verification also includes a real Chromium smoke journey:

```text
build unpacked extension
→ launch Chromium with extension
→ open options page
→ enter and save profile data
→ close browser context
→ relaunch with same user-data directory
→ verify persisted values
→ open popup
→ verify readiness
```

## Final quality gates

Verified in CI:

- `npm ci`
- unit/UI tests
- strict TypeScript typecheck
- ESLint
- Prettier check
- production WXT build
- generated Manifest V3 invariant
- `storage`-only permission invariant
- popup/options entrypoint invariant
- Playwright Chromium extension smoke test
- extension packaging

## Scope intentionally deferred

Iteration 1 did not pull these future concerns forward:

- DOM scanner/extractor
- field matcher and confidence policy
- fill-plan/filler engine
- floating in-page autofill UI
- site-specific ATS adapters
- dynamic form observer
- correction memory
- encrypted Sensitive Data Vault implementation
- backend/cloud sync
- AI
- automated document upload
- auto-submit

## Result

Iteration 1 establishes the smallest executable foundation needed for Iteration 2 without introducing backend, AI, site-specific, or generic framework abstractions prematurely.