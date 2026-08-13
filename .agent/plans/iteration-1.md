# Iteration 1 — Extension Skeleton + Profile Vertical Slice Implementation Plan

> **Execution mode:** inline in this session. TDD is mandatory for all production behavior changes. Configuration/bootstrap files use executable verification instead of artificial tests.

**Goal:** establish a loadable WXT/React Chromium extension with a versioned canonical career profile, local persistence, base-profile + variant resolution, a minimal profile editor, and a popup readiness view.

**Architecture:** keep profile meaning and resolution pure in `src/domain`, orchestration/contracts in `src/application`, browser storage in `src/infrastructure`, and React presentation in `src/ui`/entrypoints. The persisted v1 envelope stores only non-vault profile data; sensitive domain shapes are defined for future vault use but are not persisted in plaintext during Iteration 1.

**Tech stack:** WXT, Manifest V3, TypeScript strict, React, Zod, Vitest + WXT Vitest plugin, React Testing Library, ESLint flat config, Prettier, npm.

## Global constraints

- Chrome/Chromium desktop first.
- No backend, AI, content-script autofill engine, vault implementation, or ATS-specific code.
- Domain code imports no React, WXT, Chrome/browser API, or DOM types.
- Persisted data is versioned and runtime-validated.
- Variants store overrides only; never duplicate the full base profile.
- `storage` is the only extension permission required by this iteration.
- RED → GREEN → REFACTOR for every behavior change.

---

### Task 1: Project bootstrap and quality gates

**Files:**
- Create: `package.json`, `package-lock.json`, `tsconfig.json`, `wxt.config.ts`, `vitest.config.ts`, `eslint.config.mjs`, `.prettierrc.json`, `.gitignore`
- Create composition entrypoints: `entrypoints/options/index.html`, `entrypoints/options/main.tsx`, `entrypoints/popup/index.html`, `entrypoints/popup/main.tsx`

**Produces:** a WXT React project that can install dependencies, prepare generated WXT types, lint, typecheck, test, build, and zip.

- [ ] Install WXT/React/TypeScript plus test/lint dependencies.
- [ ] Configure WXT with `@wxt-dev/module-react` and manifest permission `storage` only.
- [ ] Configure strict TypeScript by extending `.wxt/tsconfig.json` and enabling `strict`/`noUncheckedIndexedAccess`.
- [ ] Configure Vitest with `WxtVitest()` and jsdom for React tests.
- [ ] Configure ESLint flat config using `@eslint/js` + `typescript-eslint`; exclude generated/build directories.
- [ ] Run `npm install`, `npm run prepare`, `npm run typecheck`, and `npm run build` to verify the bootstrap itself.

### Task 2: Canonical profile v1 schema and migration boundary

**Files:**
- Test first: `src/domain/profile/profile-schema.test.ts`
- Create after RED: `src/domain/profile/profile-schema.ts`, `src/domain/profile/create-empty-profile.ts`, `src/domain/profile/migrations.ts`

**Produces:**
- `StoredProfileEnvelopeSchema` / `StoredProfileEnvelope`
- `SensitiveProfileSchema` / `SensitiveProfile` (defined but not stored in the normal envelope)
- `createEmptyStoredProfile(): StoredProfileEnvelope`
- `parseStoredProfile(raw: unknown): StoredProfileEnvelope`

- [ ] RED: test that a valid v1 envelope parses, repeated experience/education remain arrays, unknown/invalid persisted structures are rejected, and a future schema version throws an explicit unsupported-version error.
- [ ] Run focused test and confirm failure because schema/parser do not exist.
- [ ] GREEN: implement the complete canonical domain shape required by FR-01, separating vault-designated sensitive values from normal v1 persistence.
- [ ] GREEN: implement a v1-only migration dispatcher; do not invent fake v0 migrations.
- [ ] Run focused tests until green.
- [ ] REFACTOR: remove schema duplication and keep factories explicit; rerun tests.

### Task 3: Variant resolution and local profile repository

**Files:**
- Test first: `src/domain/variants/resolve-profile.test.ts`, `src/infrastructure/storage/chrome-profile-repository.test.ts`
- Create after RED: `src/domain/variants/resolve-profile.ts`, `src/application/profile/profile-repository.ts`, `src/infrastructure/storage/chrome-profile-repository.ts`

**Produces:**
- `resolveApplicationProfile(baseProfile, variant?)`
- `ProfileRepository` with `load()` and `save(profile)`
- `ChromeProfileRepository`

- [ ] RED: verify a variant overrides headline/summary/job preferences while base identity/contact/experience remain intact and the variant object contains no full base-profile copy.
- [ ] RED: verify save/load round-trip through fake `browser.storage.local`, empty storage returns `null`, and invalid stored payload is rejected instead of cast into the UI.
- [ ] Run focused tests and confirm expected failures before implementation.
- [ ] GREEN: implement pure variant resolution with immutable object/array handling.
- [ ] GREEN: implement repository adapter using `wxt/browser`; parse every load through the migration/schema boundary.
- [ ] Run focused tests and the whole unit suite.
- [ ] REFACTOR only after green.

### Task 4: Profile editor vertical slice

**Files:**
- Test first: `src/ui/profile/ProfilePage.test.tsx`
- Create after RED: `src/ui/profile/ProfilePage.tsx`, `src/ui/profile/profile.css`, `entrypoints/options/App.tsx`

**Produces:** a profile page supporting the Iteration 1 UI sections: basic identity, contact, links, experience, education, skills, and application variants.

- [ ] RED: render with an empty profile and verify editing first/last name and primary email updates controlled state.
- [ ] RED: verify add/remove experience, education, skill, and variant operations update the profile without mutating unrelated sections.
- [ ] RED: verify Save calls the injected repository once with a schema-valid envelope and reload rehydrates persisted state.
- [ ] Run UI tests and confirm expected failures before implementation.
- [ ] GREEN: build the smallest accessible form UI with semantic labels/buttons and no form framework/global state library.
- [ ] GREEN: `entrypoints/options/App.tsx` is a thin composition root that injects `ChromeProfileRepository`.
- [ ] Run focused UI tests, full tests, and typecheck.
- [ ] REFACTOR after green; keep component boundaries driven by reasons to change, not line-count rules.

### Task 5: Popup readiness and Iteration 1 verification

**Files:**
- Test first: `src/application/profile/profile-readiness.test.ts`, `src/ui/popup/PopupPage.test.tsx`
- Create after RED: `src/application/profile/profile-readiness.ts`, `src/ui/popup/PopupPage.tsx`, `src/ui/popup/popup.css`, `entrypoints/popup/App.tsx`
- Modify after verification: `.agent/iteration-state.md`

**Produces:** a toolbar popup that loads the profile, shows a simple readiness summary, displays base/variant count, and opens the options/profile page.

- [ ] RED: define readiness from six useful sections (identity, contact, links, experience, education, skills) and verify deterministic completed/total/percentage output.
- [ ] RED: verify popup renders empty/ready states from an injected repository and calls injected `openOptions()` from the settings action.
- [ ] Run focused tests and confirm failures.
- [ ] GREEN: implement readiness as pure application logic and the popup as a small React component; keep browser API wiring in the entrypoint.
- [ ] Run focused tests and all tests.
- [ ] Run final `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run zip`.
- [ ] Inspect generated manifest to confirm Manifest V3 and no permissions beyond `storage` for this iteration.
- [ ] Update `.agent/iteration-state.md` with verified results only after all gates pass.

## Self-review

- Scope matches Iteration 1 only; no scanner/matcher/filler/floating UI/vault/backend/AI work is pulled forward.
- Every production behavior task starts with a failing automated test.
- Stored sensitive values are deliberately deferred to encrypted-vault persistence; defining their domain shape now does not authorize plaintext storage.
- Storage and UI depend on domain/application contracts; domain remains browser/framework agnostic.
- No placeholder migration, site adapter, repository-per-entity pattern, or global state layer is introduced.