# Iteration State

This file is the single current-state tracker. Do not create permanent iteration branches or scatter `plan-*.md` files across the repository.

## Project status

Phase: Iteration 3 complete; Iteration 4 ready.

Repository state: the Fillio Chromium extension has a verified local-first profile foundation, generic form analysis and explicit safe autofill, plus dynamic/multi-step re-analysis and scoped user correction memory. It can detect representative career-form controls, map supported factual fields deterministically, expose Ready / Needs review / Unknown results, remember an explicit mapping or ignore decision for the exact site/form/field, re-analyze relevant DOM changes without filling automatically, fill only Ready values after an explicit user action, and surface current-page analysis through the toolbar popup.

## Decisions locked

- Product: career-form autofill browser extension.
- Desktop Chrome/Chromium first.
- Local-first MVP; no account/backend/cloud sync.
- WXT + TypeScript + React + Manifest V3.
- Generic HTTP/HTTPS content script in an isolated world.
- Floating in-page action + toolbar popup/detail UI.
- Manual profile creation now; future CV import writes into the same canonical schema.
- Complete canonical profile schema with progressive UI disclosure.
- Sensitive Data Vault is opt-in, passphrase-protected, encrypted locally; implementation begins in Iteration 4.
- Vault auto-lock target: 30 minutes of Fillio inactivity.
- Sensitive disclosure requires explicit approval for the current site/fill operation.
- One base profile + lightweight application variants.
- Variant recommendation uses deterministic page/job keyword scoring when page-level recommendation work is introduced.
- Field confidence: Ready / Needs review / Unknown.
- User mapping corrections are stored as mapping metadata only and scoped by exact `origin + formFingerprint + fieldFingerprint`.
- User corrections cannot bypass sensitive-field or file-input fail-closed guards.
- Form identity must remain stable across dynamic field additions/removals.
- Dynamic/multi-step form changes trigger debounced semantic re-analysis only; they never trigger automatic fill, next, submit, or file upload.
- Generic DOM engine first. Site adapters only after a documented generic-engine failure.
- No auto-submit.
- No AI dependency in MVP.
- Document metadata may be stored; actual file upload remains user-driven in MVP.
- Production behavior changes use mandatory RED → GREEN → REFACTOR TDD.

## Iteration 0 — Project operating system

Status: completed.

Delivered: requirements, architecture, code patterns, security rules, git/release strategy, TDD policy, and project skills under `.agent`.

## Iteration 1 — Extension skeleton + profile vertical slice

Status: completed.

Delivered:

1. WXT + React + strict TypeScript Manifest V3 project.
2. Reproducible npm lockfile, lint, Prettier, Vitest, build, packaging, and GitHub Actions CI.
3. Versioned canonical profile envelope with runtime validation and unsupported-version handling.
4. Complete normal career-profile domain shape plus separate sensitive-profile domain shape; sensitive values are not persisted in the normal profile envelope.
5. `ProfileRepository` port and `ChromeProfileRepository` using `browser.storage.local`.
6. Pure base-profile + lightweight application-variant resolution.
7. Options/profile editor and toolbar popup with deterministic readiness summary.
8. Chromium smoke verification of persistence across browser restart.
9. Generated-manifest verification with Manifest V3 and minimal permissions.

## Iteration 2 — Generic form analysis and safe autofill

Status: completed.

Delivered:

1. Serializable `FieldContext` contracts; raw DOM elements stay outside domain/application logic.
2. Semantic field/form fingerprints.
3. Generic DOM extraction for text-like inputs, textarea, select, checkbox, radio, date, and file detection.
4. Centralized English/Indonesian normalization and alias catalog.
5. Deterministic matcher with exact alias, structured heuristic, Review, Unknown, file, and sensitive fail-closed outcomes.
6. Explicit fill-plan generation; only Ready mappings with available normal-profile values become fill instructions.
7. Generic filler using native setters plus bubbling `input` / `change` events, with per-field failure isolation and no submit behavior.
8. HTTP/HTTPS content-script analysis plus isolated Shadow DOM floating Fillio control.
9. Toolbar popup current-page summary through one-shot extension messaging.
10. Chromium acceptance proving static detection, explicit fill, select mapping, event dispatch, sensitive/file/unknown exclusion, and zero submission.

Final Iteration 2 CI: 43 unit/UI tests plus typecheck, lint, format check, production build, manifest invariants, Chromium smoke, and packaging passed.

## Iteration 3 — Dynamic forms + correction memory

Status: completed.

Goal achieved: support dynamic/multi-step career forms and remember explicit user mapping corrections without weakening fail-closed safety or explicit-fill behavior.

Delivered:

1. Versioned `StoredCorrectionEnvelope { schemaVersion: 1, entries[] }` storing mapping metadata only.
2. Correction target restricted to supported non-sensitive canonical fields or `ignore`.
3. Exact correction scope: `origin + formFingerprint + fieldFingerprint`.
4. `CorrectionRepository` port plus `ChromeCorrectionRepository` using `fillio.corrections` in local extension storage.
5. Correction precedence over deterministic matching only after sensitive/file guards; `ignore` becomes Unknown.
6. Stable generic form identity based on form metadata rather than the dynamic list of controls.
7. Order-insensitive semantic field-set fingerprint used to avoid unnecessary re-analysis.
8. Stoppable relevant `MutationObserver` with debounce, attribute filtering, and Fillio-host exclusion.
9. Floating Review UI with explicit candidate mapping and Ignore actions; React UI owns no storage/browser API.
10. Correction save immediately re-analyzes the current page but does not fill anything.
11. Relevant dynamic DOM changes trigger re-analysis only when the semantic field set changes; filler still runs only after the user clicks Fill.
12. Current-page summary stays synchronized with the latest analysis for popup messaging.
13. Chromium acceptance covering correction reuse after reload, different-form isolation, site-owned Next causing debounced re-analysis, new fields remaining empty until Fill, and zero automatic submission.

TDD/verification evidence:

- Correction matcher/schema behavior was introduced RED-first, including exact scope, ignore, sensitive/file fail-closed, and version validation.
- Correction repository behavior was introduced RED-first, including exact-key replacement and malformed-data rejection.
- Dynamic form identity, semantic field-set fingerprint, mutation relevance/debounce, and disconnect behavior were introduced RED-first.
- Correction-aware page analysis and Review UI were introduced RED-first.
- Browser acceptance exposed two test-fixture issues during verification: an ambiguous Playwright `Name` locator and an incorrect Ready count after reusing the broader shared fixture. Both were corrected in the test without weakening production behavior.
- Final acceptance was tightened during review to verify site-owned Next, zero submission, and different-form correction isolation.

Acceptance criteria status:

- exact site/form/field correction memory: verified by domain/storage tests and Chromium reload journey
- correction cannot bypass sensitive/file guards: verified
- dynamic form identity stable across control additions/removals: verified
- debounced relevant rescan with Fillio/irrelevant mutation filtering: verified
- site-owned Next leads to automatic re-analysis only: verified in Chromium
- dynamic fields are never auto-filled: verified in Chromium
- correction save never auto-fills: verified in Chromium
- different form does not inherit remembered correction: verified in Chromium; different origin/form/field isolation also covered by domain tests
- no automatic next/submit/file upload: preserved; Chromium submit count remains zero
- popup summary uses latest analysis state: preserved by content-script orchestration and popup messaging contract
- no backend, AI, vault, or ATS-specific adapter added: preserved

Final Iteration 3 branch verification: 57 unit/UI tests plus typecheck, lint, format check, production build, generated-manifest invariants, legacy Chromium smoke, Iteration 3 Chromium acceptance, and extension packaging passed in read-only CI.

## Iteration 4 — Sensitive Data Vault

Status: ready.

Expected scope:

- opt-in vault setup
- PBKDF2/AES-GCM envelope
- unlock session
- 30-minute Fillio-inactivity auto-lock
- sensitive field classification
- per-site fill disclosure summary/approval
- reset flow with destructive confirmation
- security-focused tests

## Iteration 5 — MVP hardening and release

Status: queued.

Expected scope:

- test corpus expansion across representative local/global career form patterns
- permission review
- performance profiling of scanning/mutation behavior
- accessibility pass
- packaging and release workflow
- README/user documentation
- first `0.x` tagged release

## Iteration discipline

- Work on one iteration task at a time.
- A follow-up discovered during a task remains in the same task/branch unless it is genuinely independent.
- Update this file when a task materially changes status or scope.
- Do not mark an iteration complete because code exists; verify its acceptance criteria.
- Do not pull future iteration features forward merely because they are easy to add.
