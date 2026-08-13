# Iteration State

This file is the single current-state tracker. Do not create permanent iteration branches or scatter `plan-*.md` files across the repository.

## Project status

Phase: Iteration 2 complete; Iteration 3 ready.

Repository state: the Fillio Chromium extension has a verified local-first profile foundation plus a generic static-form analysis and safe autofill engine. It can detect representative career-form controls, map supported factual fields deterministically, expose Ready / Needs review / Unknown results, fill only Ready values after an explicit user action, and surface current-page analysis through the toolbar popup. Dynamic/multi-step rescanning and correction memory have not started.

## Decisions locked

- Product: career-form autofill browser extension.
- Desktop Chrome/Chromium first.
- Local-first MVP; no account/backend/cloud sync.
- WXT + TypeScript + React + Manifest V3.
- Automatic static form detection is implemented through a generic content script.
- Floating in-page action + toolbar popup/detail UI.
- Manual profile creation now; future CV import writes into the same canonical schema.
- Complete canonical profile schema with progressive UI disclosure.
- Sensitive Data Vault is opt-in, passphrase-protected, encrypted locally; implementation is deferred to Iteration 4.
- Vault auto-lock target: 30 minutes of Fillio inactivity.
- Sensitive disclosure requires explicit approval for the current site/fill operation.
- One base profile + lightweight application variants.
- Variant recommendation uses deterministic page/job keyword scoring when page-level recommendation work is introduced; Iteration 2 only resolves the selected/default variant.
- Field confidence: Ready / Needs review / Unknown.
- User mapping corrections are remembered only for the relevant site/form; implementation begins in Iteration 3.
- Dynamic/multi-step forms trigger debounced automatic rescan, not automatic filling; implementation begins in Iteration 3.
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

## Iteration 2 — Generic form analysis and safe autofill

Status: completed.

Goal achieved: first useful autofill on representative static career forms without ATS-specific code or automatic submission.

Delivered:

1. Serializable `FieldContext` / option / control contracts; raw DOM elements stay outside domain/application logic.
2. Stable semantic field and form fingerprints that do not depend on generated DOM IDs.
3. Generic DOM extraction for text-like inputs, textarea, select, checkbox, radio groups, date, and file detection; hidden/button/submit controls are excluded from form intelligence.
4. Centralized English/Indonesian normalization and alias catalog for supported factual career fields.
5. Deterministic matcher with exact alias, structured heuristic, ambiguous review, unknown, file, and sensitive fail-closed outcomes.
6. Explicit fill-plan generation: only Ready mappings with available normal-profile values become fill instructions; review/unknown/missing values remain unfilled.
7. Generic filler using native value/checked setters plus bubbling `input` / `change` events for supported controls, with per-field failure isolation and no submit behavior.
8. Automatic HTTP/HTTPS content-script analysis in an isolated world plus a Shadow DOM floating Fillio control. The control only triggers filling after an explicit user click.
9. Toolbar popup current-page summary through one-shot extension messaging.
10. Chromium acceptance fixture proving profile persistence, static form detection, Ready / Needs review / Unknown summary, explicit safe fill, select label-to-value mapping, event dispatch, sensitive/file/unknown exclusion, and zero form submissions.
11. Generated-manifest CI invariant: Manifest V3; normal extension permission remains `storage`; no separate `host_permissions`; generic content-script matches are explicitly restricted to HTTP/HTTPS URL patterns and verified in CI.

TDD/verification evidence:

- Form contracts, normalization, fingerprints, deterministic matcher, and fill-plan behavior were introduced RED-first and then made GREEN.
- DOM extraction/filling behavior was introduced RED-first, including radio grouping, select/checkbox/date behavior, event dispatch, missing-field isolation, and no-submit semantics.
- Page analysis, floating explicit-fill UI, and popup current-page summary were introduced RED-first before implementation.
- Chromium acceptance first exposed an actual async messaging bug; the failure was preserved as RED and fixed by returning a promise from the content-script message listener.
- A separate Chromium fixture mismatch showed `display_name` was a strong preferred-name signal rather than an ambiguous generic-name case; the fixture was corrected rather than weakening matcher behavior or assertions.
- Final read-only CI passes all 43 unit/UI tests, typecheck, lint, format check, production build, generated-manifest invariants, Chromium end-to-end smoke verification, and extension packaging.

Acceptance criteria status:

- automatic static-form detection: verified in real Chromium
- common factual fields recognized deterministically: verified by unit corpus and Chromium fixture
- Ready values fill only after explicit user action: verified
- Needs review / Unknown / sensitive / file controls are not silently filled: verified
- select, checkbox, radio, and date filling primitives: verified in DOM adapter tests; representative Chromium fixture covers select plus text-like fields
- normal browser events are dispatched and form submission remains zero: verified
- floating UI is mounted through isolated Shadow DOM infrastructure: verified by built content-script journey
- popup current-page summary contract and UI: verified by UI tests; real content-script response is verified in Chromium
- domain/application matching contracts contain no DOM/browser objects: preserved by module boundaries
- no ATS-specific hostname branches or network calls: preserved
- dynamic rescan and correction memory remain deferred: preserved

Non-scope remained out of Iteration 2:

- MutationObserver/dynamic rescan pipeline
- multi-step rescan orchestration
- site/form correction memory
- sensitive vault implementation/disclosure approval
- site-specific ATS adapters
- AI/LLM
- automatic file upload
- automatic submit/next/apply clicks

## Iteration 3 — Dynamic forms + correction memory

Status: ready; not started.

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
