# Iteration State

This file is the single current-state tracker. Do not create permanent iteration branches or scatter `plan-*.md` files across the repository.

## Project status

Phase: foundation review / pre-implementation

Repository state: the `.agent` project operating system has been established. No application implementation has started yet.

## Decisions locked

- Product: career-form autofill browser extension.
- Desktop Chrome/Chromium first.
- Local-first MVP; no account/backend/cloud sync.
- WXT + TypeScript + React + Manifest V3 recommended.
- Automatic form detection.
- Floating in-page action + toolbar popup/detail UI.
- Manual profile creation now; future CV import writes into the same canonical schema.
- Complete canonical profile schema with progressive UI disclosure.
- Sensitive Data Vault is opt-in, passphrase-protected, encrypted locally.
- Vault auto-lock: 30 minutes of Fillio inactivity.
- Sensitive disclosure requires explicit approval for the current site/fill operation.
- One base profile + lightweight application variants.
- Variant recommendation uses deterministic page/job keyword scoring in MVP.
- Field confidence: Ready / Needs review / Unknown.
- User mapping corrections are remembered only for the relevant site/form.
- Dynamic/multi-step forms trigger debounced automatic rescan, not automatic filling.
- Generic DOM engine first. Site adapters only after a documented generic-engine failure.
- No auto-submit.
- No AI dependency in MVP.
- Document metadata may be stored; actual file upload remains user-driven in MVP.

## Iteration 0 — Project operating system

Status: awaiting user review.

Acceptance criteria:

- requirements are explicit and internally consistent
- architecture has clear domain/infrastructure/UI boundaries
- code patterns prevent browser/DOM concerns leaking into domain logic
- security rules define vault and sensitive-data behavior
- git strategy prevents branch and commit spam
- release strategy supports 0.x MVP releases without release-branch complexity
- role/domain skills exist for extension, frontend UI, matching, security, future backend sync, and testing

Internal documentation/self-consistency check is complete. Iteration 0 exits only after the user has reviewed/approved the foundation or requested changes have been incorporated.

## Iteration 1 — Extension skeleton + profile vertical slice

Status: ready after Iteration 0 approval; not started.

Goal: prove the chosen project structure and persistence path with the smallest end-to-end slice before building the form engine.

Scope:

1. Initialize WXT + TypeScript + React project.
2. Configure strict TypeScript, lint/format, unit test runner, production build.
3. Create only the module folders required by this iteration.
4. Define canonical profile envelope `schemaVersion: 1` with the complete domain shape but implement UI for the first useful sections.
5. Implement `ProfileRepository` with a `chrome.storage.local` adapter.
6. Implement base profile + application-variant resolution as pure logic.
7. Build options/profile UI for:
   - basic identity (non-sensitive subset)
   - contact
   - links
   - experience
   - education
   - skills
   - variant creation/selection
8. Add popup shell that shows profile readiness and opens profile settings.
9. Add migrations boundary even though only v1 exists; do not invent migrations yet.
10. Unit-test schema parsing, persistence serialization, and variant resolution.

Non-scope:

- DOM scanner/matcher/filler
- floating page UI
- sensitive vault implementation
- backend
- AI
- document binary storage
- ATS-specific code

Acceptance criteria:

- extension loads unpacked in Chromium
- profile can be created, edited, reloaded, and remains after browser restart
- variant stores only overrides and resolves correctly with base profile
- invalid persisted payload cannot silently corrupt UI state
- domain modules import no Chrome/WXT/React APIs
- test/build/typecheck commands pass
- no unnecessary extension permissions

## Iteration 2 — Generic form analysis and safe autofill

Status: queued.

Goal: first useful autofill on representative static forms.

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
