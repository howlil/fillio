# Iteration State

This file is the single current-state tracker. Do not create permanent iteration branches or scatter `plan-*.md` files across the repository.

## Project status

Phase: Iteration 1 complete; Iteration 2 ready.

Repository state: the Fillio Chromium extension foundation is implemented. The canonical profile v1, local persistence, application variants, options/profile editor, toolbar popup/readiness, CI quality gates, and Chromium persistence smoke test are in place. The generic form analysis/autofill engine has not started.

## Decisions locked

- Product: career-form autofill browser extension.
- Desktop Chrome/Chromium first.
- Local-first MVP; no account/backend/cloud sync.
- WXT + TypeScript + React + Manifest V3.
- Automatic form detection is planned for Iteration 2.
- Floating in-page action + toolbar popup/detail UI; floating UI begins with the form engine, not Iteration 1.
- Manual profile creation now; future CV import writes into the same canonical schema.
- Complete canonical profile schema with progressive UI disclosure.
- Sensitive Data Vault is opt-in, passphrase-protected, encrypted locally; implementation is deferred to Iteration 4.
- Vault auto-lock target: 30 minutes of Fillio inactivity.
- Sensitive disclosure requires explicit approval for the current site/fill operation.
- One base profile + lightweight application variants.
- Variant recommendation uses deterministic page/job keyword scoring when form/page analysis exists.
- Field confidence: Ready / Needs review / Unknown.
- User mapping corrections are remembered only for the relevant site/form.
- Dynamic/multi-step forms trigger debounced automatic rescan, not automatic filling.
- Generic DOM engine first. Site adapters only after a documented generic-engine failure.
- No auto-submit.
- No AI dependency in MVP.
- Document metadata may be stored; actual file upload remains user-driven in MVP.
- Production behavior changes use mandatory RED → GREEN → REFACTOR TDD.

## Iteration 0 — Project operating system

Status: completed.

The user approved proceeding from the foundation into implementation. Requirements, architecture, code patterns, security rules, git/release strategy, TDD policy, and project skills are established in `.agent`.

## Iteration 1 — Extension skeleton + profile vertical slice

Status: completed.

Goal achieved: prove the project structure and persistence path with the smallest useful end-to-end slice before building the form engine.

Delivered:

1. WXT + React + strict TypeScript Manifest V3 project.
2. Reproducible npm lockfile, lint, Prettier, Vitest, WXT test integration, build, packaging, and GitHub Actions CI.
3. Versioned canonical `schemaVersion: 1` profile envelope with runtime validation and explicit unsupported-version handling.
4. Complete normal career-profile domain shape plus a separate sensitive-profile domain shape; sensitive values are not persisted in the normal profile envelope.
5. `ProfileRepository` application port and `ChromeProfileRepository` using `browser.storage.local`.
6. Pure base-profile + lightweight application-variant resolution.
7. Options/profile editor for non-sensitive identity, contact, links, experience, education, skills, and application variants.
8. Toolbar popup with deterministic profile-readiness summary and variant visibility.
9. Chromium smoke verification that loads the unpacked built extension, saves profile data, restarts the browser context, verifies persisted values, and verifies popup readiness.
10. Generated-manifest verification: Manifest V3, popup/options entrypoints present, and extension permissions restricted to `storage` for this iteration.

TDD/verification evidence:

- Schema behavior was introduced RED-first, then implemented GREEN and refactored.
- Variant resolution and local repository behavior were introduced RED-first, then implemented GREEN.
- Profile editor behavior was introduced RED-first, then implemented GREEN.
- Popup/readiness behavior was introduced RED-first, then implemented GREEN.
- Chromium smoke verification passes against the built extension and confirms persistence across browser restart.
- Unit/UI tests, typecheck, lint, format check, production build, manifest invariant check, browser smoke, and extension packaging have all passed in CI.

Acceptance criteria status:

- extension loads unpacked in Chromium: verified by browser smoke test
- profile can be created, edited, reloaded, and remains after browser restart: verified by UI/repository tests and Chromium restart smoke test
- variant stores only overrides and resolves correctly with base profile: verified
- invalid persisted payload cannot silently corrupt UI state: verified
- domain modules import no Chrome/WXT/React/DOM APIs: architecture preserved and type/lint/build gates pass
- tests/build/typecheck/lint/format pass: verified
- no unnecessary extension permissions: generated manifest verified as `storage` only

Non-scope remained out of Iteration 1:

- DOM scanner/matcher/filler
- floating page UI
- sensitive vault implementation
- backend/cloud sync
- AI
- document binary storage
- ATS-specific code

## Iteration 2 — Generic form analysis and safe autofill

Status: ready; not started.

Goal: first useful autofill on representative static career forms.

Expected scope:

- scanner and extractor
- normalized aliases
- deterministic matcher
- confidence bands
- fill-plan generation
- generic filler
- floating UI
- popup analysis summary
- representative form fixture corpus
- no site-specific adapter unless a fixture proves it is necessary

## Iteration 3 — Dynamic forms + correction memory

Status: queued.

Expected scope:

- relevant MutationObserver pipeline
- debounced rescan/fingerprint comparison
- multi-step form behavior
- site/form/field correction persistence
- Review workflow
- correction precedence tests

## Iteration 4 — Sensitive Data Vault

Status: queued.

Expected scope:

- opt-in vault setup
- PBKDF2/AES-GCM envelope
- unlock session
- 30-minute inactivity auto-lock
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
