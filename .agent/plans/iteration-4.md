# Iteration 4 — Sensitive Data Vault Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:executing-plans inline for this repository; the user does not use subagent-driven execution. Steps use checkbox syntax for tracking.

**Goal:** add an opt-in locally encrypted Sensitive Data Vault that stays locked by default, keeps the decryption key only in extension background memory while unlocked, auto-locks after Fillio inactivity, and fills sensitive career fields only after explicit per-site approval.

**Architecture:** keep the existing normal profile pipeline unchanged. Persist only a versioned encrypted vault envelope in `browser.storage.local`; Web Crypto performs PBKDF2-HMAC-SHA-256 key derivation and AES-256-GCM authenticated encryption. The MV3 background service worker owns the unlocked `CryptoKey` and inactivity session; options/content scripts use typed runtime messages and never receive or persist the key. Sensitive matching is a separate fail-closed path that never enters the normal Ready fill plan.

**Tech stack:** TypeScript, React, WXT/Manifest V3, Web Crypto API, Zod, Vitest, Testing Library, Playwright Chromium.

## Global constraints

- Chromium first; local-first; no backend/account/cloud/AI.
- Existing extension permission surface must remain `storage`; do not add host permissions.
- Vault is opt-in and absent by default.
- Persist no plaintext passphrase, plaintext sensitive profile, derived key, or decrypted key material.
- PBKDF2-HMAC-SHA-256 with 600,000 iterations, random 16-byte salt.
- AES-GCM with a 256-bit derived key, fresh random 12-byte IV on every encryption, 128-bit authentication tag, and stable version AAD.
- Wrong passphrase and tampered ciphertext fail closed with one generic unlock/decrypt error.
- Background session key is memory-only and locks after 30 minutes of Fillio vault inactivity; MV3 worker suspension may lock sooner and is acceptable.
- Timer resets only on vault unlock/read/save activity, not general page/browser activity.
- Sensitive fields never become normal Ready fields and correction memory can never override them.
- Unlocking the vault is not approval to fill. Every sensitive fill requires a new explicit user action for the current page/site operation.
- No automatic fill, Next, submit, Apply, or file upload.
- Reset/delete has a deliberate destructive confirmation and no recovery path.
- Mandatory RED → GREEN → REFACTOR for production behavior.

---

## Task 1 — Vault domain envelope and empty sensitive profile

**Files:**
- Create: `src/domain/vault/vault-envelope.ts`
- Create: `src/domain/profile/create-empty-sensitive-profile.ts`
- Test: `src/domain/vault/vault-envelope.test.ts`
- Test: `src/domain/profile/create-empty-sensitive-profile.test.ts`

**Produces:**
- `StoredVaultEnvelope` schema version 1 containing only KDF/cipher metadata, ciphertext, and timestamps.
- `createEmptySensitiveProfile(): SensitiveProfile` matching the already-defined complete `SensitiveProfileSchema`.

- [ ] RED: tests reject future/malformed envelopes and assert the empty sensitive profile validates.
- [ ] Run focused tests and verify failure is caused by missing modules.
- [ ] GREEN: implement strict Zod envelope validation and complete empty sensitive profile factory.
- [ ] Run focused + full tests; refactor only after green.

## Task 2 — Web Crypto sealing/opening and encrypted storage

**Files:**
- Create: `src/infrastructure/crypto/web-crypto-vault.ts`
- Create: `src/application/vault/vault-repository.ts`
- Create: `src/infrastructure/storage/chrome-vault-repository.ts`
- Test: `src/infrastructure/crypto/web-crypto-vault.test.ts`
- Test: `src/infrastructure/storage/chrome-vault-repository.test.ts`

**Produces:**
- `createEncryptedVault(profile, passphrase)` → `{ envelope, key }`.
- `unlockVaultKey(envelope, passphrase)` → opaque `CryptoKey` after authenticated verification.
- `decryptSensitiveProfile(envelope, key)` → validated `SensitiveProfile`.
- `reencryptSensitiveProfile(profile, envelope, key)` → envelope with same KDF metadata and fresh IV.
- `VaultRepository.load/save/delete` over storage key `fillio.vault`.

- [ ] RED: round-trip, random salt/IV, wrong passphrase, ciphertext tamper, malformed decrypted JSON, fresh IV on save, no plaintext serialized envelope, storage load/save/delete.
- [ ] Verify focused RED failures.
- [ ] GREEN minimal Web Crypto + repository implementation.
- [ ] Verify full suite, typecheck, lint; refactor encoding helpers only after green.

## Task 3 — Memory-only unlock session and background vault broker

**Files:**
- Create: `src/application/vault/vault-session.ts`
- Create: `src/application/vault/vault-messages.ts`
- Create: `src/infrastructure/messaging/chrome-vault-client.ts`
- Modify: `entrypoints/background.ts`
- Test: `src/application/vault/vault-session.test.ts`
- Test: `src/application/vault/vault-messages.test.ts`

**Produces:**
- `VaultSession` holding only an opaque key handle with `unlock`, `requireKey`, `touch`, `lock`, `status`, and 30-minute idle expiry.
- Typed commands: status, setup, unlock, lock, load-profile, save-profile, read-fields, reset.
- Background is the only runtime owner of the unlocked key; repository always remains encrypted at rest.

- [ ] RED: locked default, exact inactivity expiry, activity refresh, explicit lock, wrong-passphrase failure, reset lock/delete, no passphrase in responses.
- [ ] GREEN: implement session and message broker with fail-closed generic errors.
- [ ] Verify full suite and background build.

## Task 4 — Sensitive field classification and separate plan

**Files:**
- Create: `src/domain/matching/sensitive-fields.ts`
- Modify: `src/domain/matching/match-field.ts`
- Modify: `src/domain/matching/match-field-with-corrections.ts`
- Modify: `src/application/prepare-fill/prepare-fill-plan.ts`
- Modify: `src/application/forms/analyze-field-contexts.ts`
- Test: extend `src/domain/forms/form-engine.test.ts`
- Test: extend `src/domain/corrections/correction-memory.test.ts`
- Test: extend `src/application/forms/analyze-field-contexts.test.ts`

**Produces:**
- `SensitiveCanonicalField` for high-frequency scalar vault values: birth date/place, gender, nationality, marital status, national ID/NIK, passport, tax ID/NPWP, current salary, expected salary, sponsorship required.
- Matcher result `status: 'sensitive'` for recognized sensitive aliases.
- `FillPlan.sensitive[]`; these items are excluded from `ready` even while vault is unlocked.
- Page summary adds `sensitive` count while preserving Ready / Needs review / Unknown semantics.

- [ ] RED: recognized aliases classify as Sensitive; correction cannot override; sensitive never appears in normal Ready.
- [ ] GREEN minimal matcher/plan changes.
- [ ] Update popup summary validator/UI tests for the new count.
- [ ] Run full suite and refactor shared canonical-field catalogs only if necessary.

## Task 5 — Vault options UI

**Files:**
- Create: `src/ui/vault/SensitiveVaultSection.tsx`
- Create: `src/ui/vault/SensitiveVaultSection.test.tsx`
- Modify: `src/ui/profile/ProfilePage.tsx`
- Modify: `entrypoints/options/App.tsx`
- Modify: profile CSS only as needed using existing visual language.

**Produces:**
- Opt-in setup with passphrase + confirmation.
- Locked/unlocked status and explicit lock control.
- Progressive editor for the sensitive scalar fields classified in Task 4 while preserving the full underlying `SensitiveProfile` shape.
- Save re-encrypts with fresh IV using the in-memory session key.
- Two-step destructive reset with no recovery wording.

- [ ] RED UI tests for setup mismatch, setup success, unlock failure/success, edit/save, lock, reset confirmation.
- [ ] GREEN minimal UI and client wiring.
- [ ] Verify existing profile tests remain unchanged/green.

## Task 6 — Per-site sensitive disclosure and explicit fill

**Files:**
- Create: `src/application/vault/sensitive-values.ts`
- Modify: `src/ui/floating/FloatingPanel.tsx`
- Add: `src/ui/floating/FloatingPanel.sensitive.test.tsx`
- Modify: `entrypoints/content.tsx`
- Modify: floating styles only as needed.

**Produces:**
- Panel shows count/list of requested sensitive field labels without exposing values while locked.
- If vault absent: offer callback to open Fillio settings.
- If locked: user may explicitly enter passphrase to unlock.
- If unlocked: panel still does not fill; user must click a separate `Fill sensitive fields on <host>` approval action.
- Only after that click does content script request values from background, build sensitive fill instructions, and call the existing generic filler.
- Approval is one operation only; it is never cached across dynamic steps/reloads/sites.

- [ ] RED: locked/unlocked disclosure state, wrong-passphrase error, unlock-without-fill, explicit fill only, missing vault values skipped, no auto-submit.
- [ ] GREEN content/background/UI orchestration.
- [ ] Verify correction memory and normal Fill path remain independent.

## Task 7 — Chromium security acceptance and completion

**Files:**
- Create: `e2e/iteration4-vault.mjs`
- Modify: `package.json` to append Iteration 4 acceptance after existing E2E journeys.
- Modify: `.agent/iteration-state.md` only after all verification passes.

**Acceptance journey:**
1. Load extension with no vault; storage contains no vault key.
2. Setup vault in options with a passphrase and representative NIK/birth-date/expected-salary values.
3. Inspect `browser.storage.local`: encrypted envelope exists while passphrase and sensitive plaintext values are absent from serialized storage.
4. Navigate to local career fixture containing normal + sensitive fields.
5. Verify normal Fill does not fill sensitive controls.
6. Verify sensitive disclosure is locked; wrong passphrase fails; correct unlock succeeds but fields remain empty.
7. Click explicit site-sensitive Fill; only configured sensitive fields populate and submit count remains zero.
8. Reload: vault remains encrypted and locked again when background session is explicitly locked; unlock required before another sensitive fill.
9. Verify reset deletes encrypted vault and returns to not-configured state.

**Final gates:** `npm ci`,  all Vitest/UI tests, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, generated-manifest invariants, all Chromium E2E journeys, `npm run zip`.

- [ ] Run all final gates in read-only CI.
- [ ] Review diff against `master` for plaintext leaks, new permissions, network/backend/AI/site-specific logic, and accidental auto-fill/submit behavior.
- [ ] Update `.agent/iteration-state.md` to Iteration 4 complete / Iteration 5 ready.
- [ ] Open one PR, wait for PR CI, squash merge, verify fresh `master` CI.
